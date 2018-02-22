const Blog = require('../models/blogs');
const Comment = require('../models/comments');
let middlewareObj = {};

middlewareObj.checkBlogOwnership = 
middlewareObj.checkCommentOwnership = 







middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};


module.exports = middlewareObj;