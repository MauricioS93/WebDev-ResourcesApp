const express = require("express");
const router = express.Router();
const Blog = require("../models/blogs");

// ====================
// BLOGS ROUTE
// ====================

//Root Route
router.get("/", (req, res) => {
  res.redirect("/blogs");
});

//Index Route
router.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

//Show the new form
router.get("/blogs/new", (req, res) => {
  res.render("new");
});

// Create a new blog
router.post("/blogs", (req, res) => {
    Blog.create(req.body.blog, (err, newBlog) => {
        // console.log(req.body.blog);
        if(err){
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });
});

// Show route - show a specific post
router.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err){
            res.redirect('/blogs');
        } else {
            res.render('show', {blog: foundBlog});
        }
    });
});

// Edit Route - show the edit form
router.get('/blogs/:id/edit', (req,res) => {
    Blog.findById(req.params.id, (err, updateBlog) => {
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog: updateBlog});
        }
    });
});

// Update Route - Send information from form and update database
router.put('/blogs/:id', (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedPost) => {
        if(err) {
            res.redirect('back');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});


module.exports = router;
