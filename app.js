const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const expressSanitizer = require("express-sanitizer");
const methodOverride = require("method-override");

const app = express();

// Require Models
let Blog = require("./models/blogs");

// Require Routes
let blogRoute = require("./routes/blogs");

// App configuration
mongoose.connect("mongodb://localhost/todolist");
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// create a blog for now
// Blog.create({
//   title: 'Test one',
//   image: 'https://images.unsplash.com/photo-1470138831303-3e77dd49163e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3e4426f6ac48656306b05756326613c5&auto=format&fit=crop&w=1050&q=80',
//   body: 'this is just a test '
// });

// Tell App to use those routes created.
app.use(blogRoute);

// Listen route
app.listen(8080, "localhost", function() {
  console.log("Server is running");
});
