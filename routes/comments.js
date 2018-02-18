const express = require("express");
const router = express.Router({mergeParams: true});
const Blog = require("../models/blogs");
const Comment = require('../models/comments');

router.get('/blogs/:id/comments/new', (req, res) => {
    res.send('this is the comment route');
});


module.exports = router;