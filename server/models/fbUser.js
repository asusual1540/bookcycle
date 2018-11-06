const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')


// a well defined schema for user
var fbUserSchema = new mongoose.Schema({
    profileId: String,
    fullName: String,
    profilePic: String
})

// fbUserSchema.plugin(passportLocalMongoose)

var fbUser = mongoose.model('fbUser', fbUserSchema)
module.exports = {
    fbUser
}