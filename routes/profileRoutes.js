const express = require("express")
const router = express.Router()
const { User } = require("../server/models/user")
const { Profile } = require("../server/models/profile")
const { Book } = require("../server/models/book")
const { ObjectID } = require("mongodb")
const upload = require("../server/middleware/multer")
const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: 'bookcycle',
    api_key: '899686255551365',
    api_secret: 'e_c1gq9QHSO3IknVfQXJaYsZ1ok'
})

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

router.post(
    "/myProfile",
    upload,
    isLoggedIn,
    (req, res) => {
        const profileFields = {}
        profileFields.user = req.user.id
        if (req.body.fullName) profileFields.fullName = req.body.fullName
        if (req.body.status) profileFields.status = req.body.status
        if (req.body.location) profileFields.location = req.body.location
        if (req.body.gender) profileFields.gender = req.body.gender
        if (req.body.nationalID) profileFields.nationalID = req.body.nationalID

        if (!req.file) {
            if (req.user.facebook.profilePic || req.user.google.profilePic) {
                profileFields.profilePic = req.user.facebook.profilePic || req.user.google.profilePic
            } else {
                profileFields.profilePic = ""
            }
        } else {
            profileFields.profilePic = req.file.path
        }

        if (typeof req.body.favouriteAuthors !== 'undefined') {
            profileFields.favouriteAuthors = req.body.favouriteAuthors.split(',')
        }
        if (typeof req.body.favouriteBooks !== 'undefined') {
            profileFields.favouriteBooks = req.body.favouriteBooks.split(',')
        }
        Profile.findOne({ user: req.user.id })
            .then(profile => {
                if (!profile) {
                    console.log("else blog" + profile)
                    //create
                    cloudinary.v2.uploader.upload(profileFields.profilePic, {
                        width: 200,
                        height: 200,
                        crop: "fill"
                    },
                        (err, result) => {
                            if (err) {
                                console.log("no image was saved to cloudinary")
                            } else {
                                profileFields.profilePic = result.url
                            }
                            var newProfile = new Profile(profileFields)
                            Profile.create(newProfile, (err, profile) => {
                                if (err) {
                                    console.log(err)
                                } else {
                                    Book.find({ user: req.user.id }, (err, docs) => {
                                        if (err) return console.log(err)
                                        res.redirect("/myProfile")
                                    })
                                }
                            })
                        })
                } else {
                    Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
                        .then(profile => {
                            if (!profile) {
                                return res.json({ error: "No Profile can be updated" })
                            }
                            Book.find({ user: req.user.id }, (err, docs) => {
                                if (err) return console.log(err)
                                console.log("Profile Updated" + profile)
                                res.redirect("/myProfile")
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

router.get(
    "/editProfile",
    isLoggedIn,
    (req, res) => {
        Book.find({ user: req.user.id })
            .then(docs => {
                if (!docs) {
                    res.json({ noBook: "This user doesnt have any books" })
                }
                Profile.findOne({ user: req.user.id })
                    .then(profile => {
                        if (!profile) {
                            res.render("editProfile.ejs")
                        } else {
                            res.render("editProfile.ejs", {
                                profile,
                                docs
                            })
                        }

                    })
                    .catch(err => {
                        res.status(404).json({ err })
                    })
            })
    }
)

router.get(
    "/myProfile",
    isLoggedIn,
    (req, res) => {
        Book.find({ user: req.user.id })
            .then(docs => {
                if (!docs) {
                    res.json({ noBook: "This user doesnt have any books" })
                }
                Profile.findOne({ user: req.user.id })
                    .then(profile => {
                        if (!profile) {
                            console.log("if block ran")
                            res.redirect("/editProfile")
                        } else {
                            console.log("else block ran")
                            res.render("view-profile.ejs", {
                                profile: profile,
                                docs: docs
                            })
                        }

                    })
                    .catch(err => {
                        res.status(404).json({ err })
                    })
            })
    }
)

module.exports = router


// console.log("if blog" + profile)
                    //update
