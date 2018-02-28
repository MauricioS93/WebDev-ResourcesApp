const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
    name: String,
    lastname: String,
    email: String,
    username: String,
    password: String,
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);