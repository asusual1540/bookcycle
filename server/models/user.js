const mongoose = require('mongoose')
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    local: {
        email: String,
        password: String,
        name: String
    },
    facebook: {
        id: String,
        token: String,
        name: String,
        email: String,
        profilePic: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String,
        profilePic: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// generating a hash
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};


const User = mongoose.model('User', UserSchema)

module.exports = {
    User
}