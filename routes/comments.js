const express = require("express");
const router = express.Router({ mergeParams: true });
const Blog = require("../models/blogs");
const Comment = require("../models/comments");
const middleware = require('../middleware/index');

// New Comment form
router.get("/blogs/:id/comments/new", middleware.isLoggedIn, (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/new", { blog: blog });
    }
  });
});

// create new comment
router.post("/blogs/:id/comments", middleware.isLoggedIn, (req, res) => {
  //Find post using id
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      res.redirect("back");
    } else {
      // console.log(blog);
      //create new comment
      Comment.create(req.body.comment, (err, comments) => {
        if (err) {
          res.redirect("back");
        } else {
          //add user and id to specific comment
          comments.author.id = req.user._id;
          comments.author.username = req.user.username;
          //save comment
          comments.save();
          //connect new commento to blog post
          blog.comments.push(comments._id);
          blog.save();
          req.flash('success', 'Thank you, comment successfully created!');
          res.redirect("/blogs/" + blog._id);
        }
      });
    }
  });
});

// Edit comment
router.get("/blogs/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    res.render('comments/edit', {blog_id: req.params.id, comment: foundComment});
  });
});

// Update comment
router.put('/blogs/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// Destroy/Delete comment
router.delete('/blogs/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
        if(err) {
            res.redirect('back');
        } else {
            req.flash("success", "Comment successfully deleted!");
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

module.exports = router;
