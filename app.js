const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const expressSanitizer = require("express-sanitizer");
const methodOverride = require("method-override");
const flash = require('connect-flash');

//Authentication Packages
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Calling Express
const app = express();

// Require Models
let Blog = require('./models/blogs');
let Comment = require('./models/comments');
let User = require('./models/users');

// Require Routes
let blogsRoute = require("./routes/blogs");
let commentsRoute = require("./routes/comments");
let authRoute = require('./routes/index');

// Require Seeds
const seedDB = require("./seed");
// seedDB();

// App configuration
const url = process.env.MLABURL || process.env.MONGODBURL;
mongoose.connect(url);
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); //Hast to go before bodyParser
app.use(methodOverride("_method"));
app.use(flash());

// Passport Configuration
app.use(
  require('express-session')({
    secret: 'This is my resources App',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Adding currentUser information to use in all of our routes
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// Tell App to use those routes created.
app.use(blogsRoute);
app.use(commentsRoute);
app.use(authRoute);

// Listen route
app.listen(process.env.PORT || 8080, function() {
  console.log("Server is running");
});
