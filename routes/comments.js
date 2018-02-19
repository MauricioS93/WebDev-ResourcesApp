const express = require("express");
const router = express.Router({ mergeParams: true });
const Blog = require("../models/blogs");
const Comment = require("../models/comments");

// New Comment form
router.get("/blogs/:id/comments/new", (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/new", { blog: blog });
    }
  });
});

// create new comment
router.post("/blogs/:id/comments", (req, res) => {
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
          //connect new commento to blog post
          blog.comments.push(comments._id);
          blog.save();
          res.redirect("/blogs/" + blog._id);
        }
      });
    }
  });
});

// Edit comment
router.get("/blogs/:id/comments/:comment_id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if (err) {
      res.redirect("back");
    } else {
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
          res.redirect("back");
        } else {
            res.render('comments/edit', {blog_id: req.params.id, comment: foundComment});
        }
      });
    }
  });
});

// Update comment
router.put('/blogs/:id/comments/:comment_id', (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

module.exports = router;
