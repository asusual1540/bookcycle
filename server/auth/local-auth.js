const passport = require("passport")
var { User } = require("../models/User")
const LocalStrategy = require("passport-local").Strategy

module.exports = () => {

    passport.use(User.createStrategy())
    passport.serializeUser(User.serializeUser())
    passport.deserializeUser(User.deserializeUser())


}

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'passwd'
//   },
//   function(username, password, done) {

//   }
// ));