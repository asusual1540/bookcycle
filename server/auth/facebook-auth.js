const passport = require("passport")
const FacebookStrategy = require("passport-facebook").Strategy
const config = require("../config/config")

module.exports = () => {
    passport.use(new FacebookStrategy(config.fb, (accessToken, refreshToken, profile, done) => {

    }))
}