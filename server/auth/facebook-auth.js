const passport = require("passport")
const FacebookStrategy = require("passport-facebook").Strategy
const config = require("../config/config")
var { fbUser } = require("../models/fbUser")
var mongoose = require("mongoose")

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        fbUser.findById(id, (err, user) => {
            if (err) {
                console.log("fb user creation error")
            } else {
                console.log('success deserialising')
            }
        }).then(user => {
            done(null, user)
        }).catch(err => console.log(err))
    })

    passport.use(new FacebookStrategy(config.fb, (accessToken, refreshToken, profile, done) => {
        fbUser.findOne({
            profileId: profile.id
        }).exec().then(user => {
            if (user) {
                done(null, user)
            } else {
                const newFbUser = new fbUser({
                    profileId: profile.id,
                    fullName: profile.displayName,
                    profilePic: profile.photos[0].value || ""
                })

                newFbUser.save(error => {
                    if (error) {
                        console.log("fb user creation error")
                    } else {
                        console.log("success account created")
                    }
                }).then(user => {
                    if (user) {
                        done(null, user)
                    }
                })
            }
        })
    }))
}