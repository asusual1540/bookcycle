const mongoose = require('mongoose')
const _ = require('lodash')
const passportLocalMongoose = require('passport-local-mongoose')


// a well defined schema for user
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        requierd: true,
        trim: true, 
        minlength: 1
    }, password: {
        type: String,
        require: true,
        minlength: 4,
    }
})

UserSchema.plugin(passportLocalMongoose)

// function for sending only id and username property to user
// UserSchema.methods.toJSON = function () {
//     var user = this
//     var userObject = user.toObject()

//     return _.pick(userObject, ['_id', 'username'])
// }

// instance authentication token generating function using jsonwebtoken
// UserSchema.methods.generateAuthToken = function () {
//     var user = this
//     var access = 'auth'

//     // generate auth token
//     var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString()

//     // passing user token property
//     user.tokens.push({
//         access,
//         token
//     })
//     //returning token after saving a user
//     return user.save().then(() => {
//         return token
//     })
// }

// model method
// UserSchema.statics.findByToken = function (token) {
//     var User = this
//     var decoded

//     try {
//         decoded = jwt.verify(token, 'abc123')
//     } catch (e) {
//         // return new Promise((resolve, reject) => {
//         //     reject()
//         // })
//         return Promise.reject()
//     }
//     return User.findOne({
//         '_id': decoded._id,
//         'tokens.token': token,
//         'tokens.access': 'auth'
//     })
// }

// UserSchema.statics.findByCredentials = function (email, password) {
//     var User = this

//     return User.findOne({email}).then((user) => {
//       if (!user) {
//         return Promise.reject()
//       }
//       console.log('found user.. now verifying password')
//       console.log(`Pasword provided by user is: ${password}`)
//       console.log(`Password stored in database is: ${user.password}`)
//       return Promise((resolve, reject) => {
//         // bcrypt.compare to compare password and user.password
//         bcrypt.compare(password, user.password, (err, res) => {
//           if (res) {
//             resolve(user)
//           } else {
//               console.log(err)
//             reject()
//           }
//         })
//       })
//     })
//   }

var User = mongoose.model('User', UserSchema)
module.exports = {
    User
}