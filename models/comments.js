const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commentSchema = new Schema({
    text: String,
    author: String,
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);