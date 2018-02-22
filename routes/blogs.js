const express = require("express");
const router = express.Router({mergeParams: true});
const Blog = require("../models/blogs");

// ====================
// BLOGS ROUTE
// ====================

//Index Route
router.get("/blogs", (req, res) => {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("blogs/index", { blogs: blogs});
    }
  });
});

//NEW / Show the new form
router.get("/blogs/new", isLoggedIn, (req, res) => {
  res.render("blogs/new");
});

//CREATE / a new blog
router.post("/blogs", isLoggedIn, (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    let title = req.body.blog.title;
    let image = req.body.blog.image;
    let body = req.body.blog.body;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newBlog = {title: title, image: image, body: body, author: author};
    Blog.create(newBlog, (err, newBlog) => {
        if(err){
            res.render('blogs/new');
        } else {
            // console.log(newBlog); just to check
            res.redirect('/blogs');
        }
    });
});

// Show route - show a specific post
router.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id).populate('comments').exec((err, foundBlog) => {
        if (err){
            res.redirect('/blogs');
        } else {
            //Now we have populated the comments into the found blog, by using the populate and then executing the created query. Now we will see the actual comment related to this blog by:
            // console.log(foundBlog);
            res.render('blogs/show', {blog: foundBlog});
        }
    });
});

// Edit Route - show the edit form
router.get('/blogs/:id/edit', checkBlogOwnership,(req,res) => {
    Blog.findById(req.params.id, (err, updateBlog) => {
        res.render('blogs/edit', {blog: updateBlog});
    });  
});

// Update Route - Send information from form and update database
router.put('/blogs/:id', checkBlogOwnership, (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedPost) => {
        if(err) {
            res.redirect('back');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// Remove Route
router.delete('/blogs/:id', checkBlogOwnership, (req, res) => {
    Blog.findByIdAndRemove(req.params.id, err => {
        if (err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    });
});

// MIDDLEWARE

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkBlogOwnership (req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, (err, updateBlog) => {
            if(err){
                res.redirect('back');
            } else {
                // does user owns the blog?
// console.log(updateBlog.blog.id); this is a mongoose object ID
// console.log(req.user._id); This is a string.
// when compering they are not the same so you have to use a mongoose method called .equals()
                if(updateBlog.author.id.equals(req.user.id)){
                    next(); 
//This next() means that once i checked if user is Logged in (isAuthenticated()), found the blog and finally check if the user.id is the same as the creator of that blog, i want to run a code depending on what route i am on. for example show the edit form.
                } else {
                    console.log('No permission to edit someone else Blog');
                    res.redirect('back');
                }
            }
        });
    } else {
        console.log('You need to log in to do this');
        res.redirect('back');
    }    
}


module.exports = router;
