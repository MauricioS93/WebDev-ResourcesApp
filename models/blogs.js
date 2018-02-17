const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let blogSchema = new Schema ({
    title: String,
    image: String,
    body: String,
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Blog', blogSchema);
