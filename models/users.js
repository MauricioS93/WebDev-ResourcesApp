const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    email: String,
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false},
    avatar: {type: String, default: 'http://www.rsmhawaii.com/wp-content/uploads/2016/02/techguy-avatar-150x150.png'},
    memberSince: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);