const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let blogSchema = new Schema ({
    title: String,
    image: String,
    image_id: String,
    tag: String,
    body: String,
    link: String,
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('Blog', blogSchema);
