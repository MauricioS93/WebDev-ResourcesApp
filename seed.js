const mongoose = require('mongoose');
const Blog = require('./models/blogs');
const Comment = require('./models/comments');

let data = [
    {
        title: 'Test 123',
        image: 'https://images.unsplash.com/reserve/NJyKabKSOCpcfYU1SBLw_IMG_2670-2.jpg?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cc0660b82587392d58b0025ed1ac75eb&auto=format&fit=crop&w=1050&q=80',
        body:  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc posuere, velit eu vulputate accumsan, elit quam vulputate mi, vel feugiat quam mi sed lorem. Praesent mi nisi, sollicitudin ac ultrices et, sagittis dignissim quam. Vestibulum sollicitudin ligula et diam luctus rhoncus.'
    }, 
    {
        title: 'Demo',
        image: 'https://images.unsplash.com/photo-1469119674997-bc930fb66072?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5a828c3e29db06af3918fd1168f0f341&auto=format&fit=crop&w=1051&q=80',
        body:  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc posuere, velit eu vulputate accumsan, elit quam vulputate mi, vel feugiat quam mi sed lorem. Praesent mi nisi, sollicitudin ac ultrices et, sagittis dignissim quam. Vestibulum sollicitudin ligula et diam luctus rhoncus.'
    },
    {
        title: 'One more Demo',
        image: 'https://images.unsplash.com/photo-1490237760062-ffa70dd1f503?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=24d6a7de39829dec2c0041fb75220450&auto=format&fit=crop&w=1051&q=80',
        body:  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc posuere, velit eu vulputate accumsan, elit quam vulputate mi, vel feugiat quam mi sed lorem. Praesent mi nisi, sollicitudin ac ultrices et, sagittis dignissim quam. Vestibulum sollicitudin ligula et diam luctus rhoncus.'
    }

];



function seedDB(){
    // Remove Blogs
    Blog.remove({}, err => {
        if(err){
            console.log(err);
        }
       console.log('Removed resources'); 
       Comment.remove({}, function(err) {
        if(err){
            console.log(err);
        }
        console.log('Removed Comments');
            // data.forEach((seed) => { //This line has to go inside our Blog.remove callback to make sure that the campgrounds are removed FIRST and then the Blog is created.
            //     Blog.create(seed, (err, blog) => {
            //         if (err){
            //             console.log(err);
            //         } else {
            //             console.log('added blog');
            //             //Create a comment for each Blog
            //             Comment.create({
            //                 text: 'This is a great place',
            //                 author: 'Mauricio'
            //             }, (err, comment) => {
            //                 if(err){
            //                     console.log(err);
            //                 } else {
            //                     blog.comments.push(comment._id);
            //                     blog.save();
            //                     console.log('Created a new comment');
            //                 }
            //             });
            //         }
            //     });
            // });
        });
    });   
    // Add/create blogs 
}

module.exports = seedDB;