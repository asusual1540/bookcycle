const express = require("express")
const router = express.Router()
const { User } = require("../server/models/user")
const { Profile } = require("../server/models/profile")
const { ObjectID } = require("mongodb")
const mongoose = require("mongoose")
const passport = require("passport")

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

router.get(
    "/myProfile",
    isLoggedIn,
    (req, res) => {
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                res.render("myProfile.ejs", {
                    profile
                })
            })
            .catch(err => {
                res.status(404).json({ err })
            })
    }
)

router.post(
    "/myProfile",
    isLoggedIn,
    (req, res) => {
        const profileFields = {}
        profileFields.user = req.user.id
        if (req.body.handle) profileFields.handle = req.body.handle
        if (req.body.fullName) profileFields.fullName = req.body.fullName
        if (req.body.status) profileFields.status = req.body.status

        if (typeof req.body.favouriteAuthors !== 'undefined') {
            profileFields.favouriteAuthors = req.body.favouriteAuthors.split(',')
        }
        if (typeof req.body.favouriteBooks !== 'undefined') {
            profileFields.favouriteBooks = req.body.favouriteBooks.split(',')
        }
        if (typeof req.body.favouriteQuotes !== 'undefined') {
            profileFields.favouriteQuotes = req.body.favouriteQuotes.split(',')
        }
        if (typeof req.body.ownedBooks !== 'undefined') {
            profileFields.ownedBooks = req.body.ownedBooks.split(',')
        }
        if (typeof req.body.readBooks !== 'undefined') {
            profileFields.readBooks = req.body.readBooks.split(',')
        }
        if (req.body.location) profileFields.location = req.body.location

        profileFields.social = {}
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook
        if (req.body.google) profileFields.social.google = req.body.google

        Profile.findOne({ user: req.user.id })
            .then(profile => {
                if (!profile) {
                    //update
                    Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
                        .then(profile => res.json(profile))
                } else {
                    //create

                    // check if handle exists
                    Profile.findOne({ handle: profileFields.handle })
                        .then(profile => {
                            if (profile) {
                                res.status(400).json({ handleError: "handle already exists" })
                            }
                            new Profile(profileFields).save().then(profile => {
                                res.json(profile)
                            })
                        })
                }
            })
    }
)


router.get(
    "/users/all",
    isLoggedIn,
    (req, res) => {
        User.find().then(docs => {
            res.send({ docs })
        })
    },
    err => {
        res.status(400).send(err)
    }
)

router.get("/users/:id", (req, res) => {
    var id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid")
    }
    User.findById(id).then(
        docs => {
            if (!docs) {
                return res.send("Incorrect id..")
            }
            res.status(200).send({ docs })
        },
        err => {
            res.status(404).send(err)
        }
    )
})

module.exports = router