const express = require("express");
const router = express.Router({mergeParams: true});
const Blog = require("../models/blogs");
const Comment = require('../models/comments');


// Create a new Route
router.get('/blogs/:id/comments/new', (req, res) => {
    Blog.findById(req.params.id, (err, blog) => {
        if(err){
            res.redirect('back');
        } else {
            res.render('comments/new', { blog: blog });
        }
    });
});

// Update new route
router.post('/blogs/:id/comments', (req,res) => {
    //Find post using id
    Blog.findById(req.params.id, (err, blog) => {
        if(err){
            res.redirect('back');
        } else {
            // console.log(blog);
            //create new comment
            Comment.create(req.body.comment, (err, comments) => {
                if(err){
                    res.redirect('back');
                } else {
                    //connect new commento to blog post
                    blog.comments.push(comments._id);
                    blog.save();
                    res.redirect('/blogs/' + req.params.id);
                }
            });
        }
    }); 
});

module.exports = router;