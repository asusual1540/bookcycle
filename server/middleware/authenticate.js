// var {User} = require('./../models/user')

// //middleware function verifies x-auth or token when user requests get request
// var authenticate = (req, res, next) => {
//     var token = req.header('x-auth')
//     //we are finding the user by token in User which follows UserSchema
//     User.findByToken(token).then((user) => {
//         if(!user) {
//             //if no user exists we are rejecting the promise
//           return Promise.reject()
//         }
//         // if there is indeed a valid user by that token we give the user access to user and token
//         req.user = user
//         req.token = token
//         // then we are calling next middleware
//         next()
//     }).catch((err) => {
//         res.status(401).send()
//     })
//   }

//   module.exports = {
//       authenticate
//   }