const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const User = require("../models/users");
const Blog = require("../models/blogs");

//Root Route
router.get("/", (req, res) => {
  res.render("landing");
});

// =====================
// AUTHENTICATION ROUTES
// =====================

// Show Register Form
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle Sign Up Logic
router.post("/register", (req, res) => {
  // eval(require('locus')); //THis is a package that allows me to stop the code wherever i put it and see what are the variables i have available to use.
  let newUser = new User({
    name: req.body.name,
    lastname: req.body.lastname,
    email: req.body.email,
    username: req.body.username,
    avatar: req.body.avatar
  });
  if(req.body.admin === 'myresourceApp'){
    newUser.isAdmin = true;
  } //Checks if the admin field has the correct password.
  User.register(newUser, req.body.password, (err, createduser) => {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/blogs");
      }); //Same passport.authenticate that we are using in router.post('/login'), the difference is that here i am registering a user and automatically login it. As of router.post('/login') which only loggs in when there is a success, we assume the username is register.
    }
  });
});

// Show Login Form
router.get("/login", (req, res) => {
  res.render("login");
});

// Handling Login Logic
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/blogs",
    failureRedirect: "/login"
  }) //I can do this because of the passport-local-mongoose package we installed, thats why its important.
);

// Log Out Logic
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/blogs");
});

// =====================
// USERS PROFILES
// =====================

router.get('/users/:id', (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    if(err){
      res.redirect('back');
    } else {
      Blog.find().where('author.id').equals(foundUser.id).exec((err, foundBlog) => {
        if(err){
          res.redirect('back');
        } else {
        res.render('users/show', {user: foundUser, blogs: foundBlog});
        }
      });
    }
  });
});

module.exports = router;
