const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


// a well defined schema for user
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        requierd: true,
        trim: true,
        minlength: 1
    },
    email: {
        type: String,
        requierd: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 4
    },
    date: {
        type: Date,
        default: Date.now
    }
})

UserSchema.plugin(passportLocalMongoose)

var User = mongoose.model('User', UserSchema)
module.exports = {
    User
}