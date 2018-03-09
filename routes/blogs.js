const express = require("express");
const router = express.Router({ mergeParams: true });
const Blog = require("../models/blogs");
const middleware = require("../middleware/index");
const Comment = require("../models/comments");
const functions = require("../middleware/functions");
const dotenv = require("dotenv").config();
const User = require("../models/users");

// ====================
// IMAGE UPLOADING SETUP
// ====================

const multer = require("multer");
let storage = multer.diskStorage({
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.filename);
  }
});
let imageFilter = function(req, file, cb) {
  if (!file.filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only Images Files are allowed"), false);
  }
  cb(null, true);
};

let upload = multer({ storage: storage, imageFilter: imageFilter });

// ====================
// CLOUDINARY SETUP
// ====================

let cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "msarmiento90",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ====================
// BLOGS ROUTE
// ====================

//Index Route
router.get("/blogs", (req, res) => {
  let noMatch;
  if (req.query.search) {
    const regex = new RegExp(functions.escapeRegex(req.query.search), "gi");
    Blog.find({ $or: [{ tag: regex }, { title: regex }] }, (err, blogs) => {
      if (err) {
        console.log(err);
      } else {
        if (blogs.length < 1) {
          noMatch =
            "No Blog found under that name, please try again with a different name";
        }
        res.render("blogs/index", { blogs: blogs, noMatch: noMatch });
      }
    });
  } else {
    Blog.find({}, (err, blogs) => {
      if (err) {
        console.log(err);
      } else {
        res.render("blogs/index", { blogs: blogs, noMatch: noMatch });
      }
    });
  }
});

//NEW / Show the new form
router.get("/blogs/new", middleware.isLoggedIn, (req, res) => {
  res.render("blogs/new");
});

//CREATE / a new blog
router.post(
  "/blogs",
  middleware.isLoggedIn,
  upload.single("image"),
  (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("back");
      }
      req.body.blog.image = result.secure_url;
      req.body.blog.image_id = result.public_id;
      req.body.blog.author = {
        id: req.user._id,
        username: req.user.username
      };
      Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
          req.flash("error", err.message);
          return res.render("blogs/new");
        }
        User.findByIdAndUpdate(
          newBlog.author.id,
          { $inc: { count: 1 } },
          (err, user) => {
            if (err) {
              req.flash("error", err.message);
              return res.redirect("back");
            }
            req.flash("success", "Thank you, post successfully created");
            res.redirect("/blogs/" + newBlog.id);
          }
        );
      });
    });
  }
);

// Show route - show a specific post
router.get("/blogs/:id", (req, res) => {
  Blog.findById(req.params.id)
    .populate("comments")
    .exec((err, foundBlog) => {
      if (err) {
        res.redirect("/blogs");
      } else {
        //Now we have populated the comments into the found blog, by using the populate and then executing the created query. Now we will see the actual comment related to this blog by:
        // console.log(foundBlog);
        res.render("blogs/show", { blog: foundBlog });
      }
    });
});

// Edit Route - show the edit form
router.get("/blogs/:id/edit", middleware.checkBlogOwnership, (req, res) => {
  Blog.findById(req.params.id, (err, updateBlog) => {
    res.render("blogs/edit", { blog: updateBlog });
  });
});

// Update Route - Send information from form and update database
router.put(
  "/blogs/:id",
  middleware.checkBlogOwnership,
  upload.single("image"),
  (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //If new file has been updated
    if (req.file) {
      Blog.findById(req.params.id, (err, updatedPost) => {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
        // delete the file from clodinary
        cloudinary.v2.uploader.destroy(updatedPost.image_id, function(
          err,
          result
        ) {
          if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
          }
          // upload new image
          cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
            if (err) {
              req.flash("error", err.message);
              return res.redirect("back");
            }
            //add cloudinary secure url to the blog object
            req.body.blog.image = result.secure_url;
            //add image's public_id to blog obkect
            req.body.blog.image_id = result.public_id;
            // eval(require('locus'));
            Blog.findByIdAndUpdate(
              req.params.id,
              req.body.blog,
              (err, updatedPost) => {
                // eval(require('locus'));
                if (err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
                }
                req.flash("success", "Blog successfully updated!");
                res.redirect("/blogs/" + updatedPost._id);
              }
            );
          });
        });
      });
    } else {
      Blog.findByIdAndUpdate(
        req.params.id,
        req.body.blog,
        (err, updatedPost) => {
          if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
          }
          req.flash("success", "Blog successfully updated!");
          res.redirect("/blogs/" + req.params.id);
        }
      );
    }
  }
);

// Remove Route
router.delete("/blogs/:id", middleware.checkBlogOwnership, (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("back");
    } else {
      Comment.remove(
        {
          _id: {
            $in: foundBlog.comments
          }
        },
        err => {
          console.log(err);
        }
      );
      cloudinary.v2.uploader.destroy(foundBlog.image_id, function(err, result) {
        if (err) {
          req.flash("error", err.message);
          return res.redirect("back");
        }
        foundBlog.remove(err => {
          if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
          }
          User.findByIdAndUpdate(
            foundBlog.author.id, { $inc: { count: -1 } }, (err, user) => {
              if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
              }
              req.flash("success", "Post successfully deleted!");
              res.redirect("/blogs");
            }
          );
        });
      });
    }
  });
});

module.exports = router;
