const Blog = require('../models/blogs');
const Comment = require('../models/comments');
let middlewareObj = {};

middlewareObj.checkBlogOwnership = (req, res, next) => {
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
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
          res.redirect("back");
        } else {
          if(foundComment.author.id.equals(req.user._id)){
            next();
          } else {
            res.send('this is not your comment to edit or delete');
          }
        }
      });
    } else {
      res.send('You need to be logged in');
    }
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};


module.exports = middlewareObj;