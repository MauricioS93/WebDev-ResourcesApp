const express = require('express');
const router = express.Router({mergeParams: true});
const Blog = require('../models/blogs');
const middleware = require('../middleware/index');
const Comment = require("../models/comments");
const functions = require('../middleware/functions');

// ====================
// IMAGE UPLOADING SETUP
// ====================

const multer = require('multer');
let storage = multer.diskStorage({
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.fileOriginalName);
    }
});
let imageFilter = function(req, file, cb){
    if(!file.fileOriginalName.match(/\.(jpg|jpeg|png|gif)$/i)){
        return cb(new Error("Only Images Files are allowed"), false);
    }
    cb(null, true);
};

let upload = multer({storage: storage, imageFilter: imageFilter});

// ====================
// CLOUDINARY SETUP
// ====================


let cloudinary = require('cloudinary');
cloudinary.config({ 
    cloud_name: 'msarmiento90', 
    api_key: 687446554825594, 
    api_secret: 'f9T6dWlUcCihLT2alEeeZvMHkJo', 
});  
  

// ====================
// BLOGS ROUTE
// ====================

//Index Route
router.get("/blogs", (req, res) => {
    let noMatch;
    if(req.query.search){
        const regex = new RegExp(functions.escapeRegex(req.query.search), 'gi');
        Blog.find({title: regex}, (err, blogs) => {
            if (err) {
            console.log(err);
            } else {
                if(blogs.length < 1){
                    noMatch = "No Blog found under that name, please try again with a different name";
                }
                res.render("blogs/index", { blogs: blogs, noMatch: noMatch});
            }
        });
    } else {
        Blog.find({}, (err, blogs) => {
            if (err) {
            console.log(err);
            } else {
            res.render("blogs/index", { blogs: blogs, noMatch: noMatch});
            }
        });
    }
});

//NEW / Show the new form
router.get("/blogs/new", middleware.isLoggedIn, (req, res) => {
  res.render("blogs/new");
});

//CREATE / a new blog
router.post("/blogs", middleware.isLoggedIn, upload.single('image'), (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    cloudinary.uploader.upload(req.file.path, results => {
        req.body.blog.image = results.secure_url;
        req.body.blog.author = {
            id: req.user._id,
            username: req.user.username
        };
        Blog.create(req.body.blog, (err, newBlog) => {
            if(err){
                req.flash('error', err.message);
                res.render('blogs/new');
            } else {
                req.flash('success', 'Thank you, post successfully created');
                res.redirect('/blogs/' + newBlog.id);
            }
        });
    });
});

// Show route - show a specific post
router.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id).populate('comments').exec((err, foundBlog) => {
        if (err){
            res.redirect('/blogs');
        } else {
            //Now we have populated the comments into the found blog, by using the populate and then executing the created query. Now we will see the actual comment related to this blog by:
            // console.log(foundBlog);
            res.render('blogs/show', {blog: foundBlog});
        }
    });
});

// Edit Route - show the edit form
router.get('/blogs/:id/edit', middleware.checkBlogOwnership,(req,res) => {
    Blog.findById(req.params.id, (err, updateBlog) => {
        res.render('blogs/edit', {blog: updateBlog});
    });  
});

// Update Route - Send information from form and update database
router.put('/blogs/:id', middleware.checkBlogOwnership, (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedPost) => {
        if(err) {
            res.redirect('back');
        } else {
            req.flash("success", "Comment successfully updated!");
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// Remove Route
router.delete('/blogs/:id', middleware.checkBlogOwnership, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect('back');
        } else {
            Comment.remove({
                _id: {
                    $in: foundBlog.comments
                }
            }, (err) => {
                console.log(err);
            });
            foundBlog.remove(err => {
                if(err){
                    res.redirect('back');
                    console.log(err);
                } else {
                    req.flash("success", "Post successfully deleted!");
                    res.redirect('/blogs');
                }
            });
        }
    });
});

// function escapeRegex(text) {
//     return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
// }

module.exports = router;
