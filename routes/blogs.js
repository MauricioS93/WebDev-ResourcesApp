const express = require("express");
const router = express.Router({mergeParams: true});
const Blog = require("../models/blogs");

// ====================
// BLOGS ROUTE
// ====================

//Index Route
router.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("blogs/index", { blogs: blogs });
    }
  });
});

//Show the new form
router.get("/blogs/new", (req, res) => {
  res.render("blogs/new");
});

// Create a new blog
router.post("/blogs", (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render('blogs/new');
        } else {
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
            //Now we hage populated the comments into the found blog, by using the populate and then executing the created query. Now we will see the actual comment related to this blog by:
            // console.log(foundBlog);
            res.render('blogs/show', {blog: foundBlog});
        }
    });
});

// Edit Route - show the edit form
router.get('/blogs/:id/edit', (req,res) => {
    Blog.findById(req.params.id, (err, updateBlog) => {
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('blogs/edit', {blog: updateBlog});
        }
    });
});

// Update Route - Send information from form and update database
router.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedPost) => {
        if(err) {
            res.redirect('back');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// Remove Route
router.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, err => {
        if (err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    });
});


module.exports = router;
