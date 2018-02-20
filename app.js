const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const expressSanitizer = require("express-sanitizer");
const methodOverride = require("method-override");

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
let authRoute = require('./routes/auth');

// Require Seeds
const seedDB = require("./seed");
// seedDB();

// App configuration
mongoose.connect("mongodb://localhost/resourcesApp");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); //Hast to go before bodyParser
app.use(methodOverride("_method"));

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

// Tell App to use those routes created.
app.use(blogsRoute);
app.use(commentsRoute);
app.use(authRoute);

// Listen route
app.listen(8080, "localhost", function() {
  console.log("Server is running");
});
