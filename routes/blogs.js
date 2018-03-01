const express = require('express');
const router = express.Router({mergeParams: true});
const Blog = require('../models/blogs');
const middleware = require('../middleware/index');
const Comment = require("../models/comments");

// ====================
// BLOGS ROUTE
// ====================

//Index Route
router.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("blogs/index", { blogs: blogs});
    }
  });
});

//NEW / Show the new form
router.get("/blogs/new", middleware.isLoggedIn, (req, res) => {
  res.render("blogs/new");
});

//CREATE / a new blog
router.post("/blogs", middleware.isLoggedIn, (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    let title = req.body.blog.title;
    let image = req.body.blog.image;
    let body = req.body.blog.body;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newBlog = {title: title, image: image, body: body, author: author};
    Blog.create(newBlog, (err, newBlog) => {
        if(err){
            res.render('blogs/new');
        } else {
            req.flash('success', 'Thank you, post successfully created');
            res.redirect('/blogs');
        }
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

module.exports = router;
