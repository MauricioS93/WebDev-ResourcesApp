const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const User = require("../models/users");

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
  var newUser = new User({
    name: req.body.name,
    lasname: req.body.name,
    email: req.body.email,
    username: req.body.username
  });

  User.register(newUser, req.body.password, (err, createduser) => {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/blogs");
      }); //Same passport.authenticate that we are using in line 47, the difference is that here i am registering a user and automatically login it. As of line 47 which only loggs in when there is a success, we assume the username is register.
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

module.exports = router;
