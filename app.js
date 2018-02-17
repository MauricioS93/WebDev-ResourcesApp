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
mongoose.connect("mongodb://localhost/resourcesApp");
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(expressSanitizer()); //Hast to go before bodyParser
app.use(methodOverride("_method"));

// Tell App to use those routes created.
app.use(blogRoute);

// Listen route
app.listen(8080, "localhost", function() {
  console.log("Server is running");
});
