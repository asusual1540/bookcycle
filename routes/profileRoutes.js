const express = require("express")
const router = express.Router()
const { User } = require("../server/models/user")
const { Profile } = require("../server/models/profile")
const { Book } = require("../server/models/book")
const Cart = require("../server/models/cart")
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

function previous_user_profile(id) {
    Profile.findOne({ user: id }).then(profile => {
        if (profile) { return profile } else { return null }
    })
}

router.post(
    "/myProfile",
    upload,
    isLoggedIn,
    (req, res) => {
        var previous_profile = previous_user_profile(req.user.id)
        const profileFields = {}
        profileFields.user = req.user.id
        if (req.body.fullName) {
            profileFields.fullName = req.body.fullName
        } else {
            profileFields.fullName = previous_profile.fullName
        }
        if (req.body.status) {
            profileFields.status = req.body.status
        } else {
            profileFields.status = previous_profile.status
        }
        if (req.body.location) {
            profileFields.location = req.body.location
        } else {
            profileFields.location = previous_profile.location
        }
        if (req.body.gender) {
            profileFields.gender = req.body.gender
        } else {
            profileFields.gender = previous_profile.gender
        }
        if (req.body.nationalID) {
            profileFields.nationalID = req.body.nationalID
        } else {
            profileFields.nationalID = previous_profile.nationalID
        }

        if (typeof req.body.favouriteAuthors !== 'undefined') {
            profileFields.favouriteAuthors = req.body.favouriteAuthors.split(',')
        } else {
            profileFields.favouriteAuthors = previous_profile.favouriteAuthors
        }
        if (typeof req.body.favouriteBooks !== 'undefined') {
            profileFields.favouriteBooks = req.body.favouriteBooks.split(',')
        } else {
            profileFields.favouriteBooks = previous_profile.favouriteBooks
        }

        if (!req.file) {
            if (req.user.facebook.profilePic || req.user.google.profilePic) {
                profileFields.profilePic = req.user.facebook.profilePic || req.user.google.profilePic
            } else {
                Profile.findOne({ user: req.user.id })
                    .then(profile => {
                        if (!profile) {
                            profileFields.profilePic = ""
                        } else {
                            profileFields.profilePic = profile.profilePic
                        }
                    })
            }
        } else {
            profileFields.profilePic = req.file.path
        }
        Profile.findOne({ user: req.user.id })
            .then(profile => {

                if (!profile) {

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
                    console.log("bal")
                    cloudinary.v2.uploader.upload(profileFields.profilePic, {
                        width: 200,
                        height: 200,
                        crop: "fill"
                    },
                        (err, result) => {
                            if (err) {
                                console.log("no image was saved to cloudinary and was provided")
                            } else {
                                profileFields.profilePic = result.url
                            }
                            Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
                                .then(profile => {
                                    if (!profile) {
                                        return res.json({ error: "No Profile can be updated" })
                                    }
                                    Profile.find({ user: req.user.id }, (err, docs) => {
                                        if (err) return console.log(err)
                                        console.log("Profile Updated" + profile)
                                        res.redirect("/myProfile")
                                    })
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
                            res.redirect("/editProfile")
                        } else {
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


router.post("/add-fund/", (req, res) => {
    var amount = Number(req.body.amount)
    console.log("recharge amount" + amount)
    Profile.findOne({ user: req.user.id })
        .then(
            profile => {
                if (profile) {
                    console.log("profile found" + profile)
                    profile.balance += amount
                }
                profile.save()
                res.redirect("/myProfile")
            }
        )
})

function transfer(arr, bookID_to_transfer, sellerID, buyerID, callback) {
    arr.forEach(item => {
        Book.findById(bookID_to_transfer).then(
            book => {
                Profile.findOne({ user: buyerID }).then(
                    buyer => {
                        Profile.findOne({ user: sellerID }).then(
                            seller => {
                                if (buyer.balance < book.price) {
                                    res.json({ msg: "Not enough balance to buy" })
                                } else {
                                    buyer.balance -= book.price
                                    seller.balance += book.price
                                    for (var i = 0; i < seller.ownedBooks.length - 1; i++) {
                                        if (array[i] === book.id) {
                                            arr.splice(i, 1)
                                        }
                                    }
                                    buyer.boughtBooks.push(book.id)
                                    book.user = buyer.user
                                    book.ownerName = buyer.fullName
                                    book.save()
                                    buyer.save()
                                    seller.save()
                                    cart.reduceByOne(book_id)
                                }
                            }
                        )
                    }
                )
            }
        )
    })
    callback()
}

router.get("/check-out", (req, res) => {
    var cart = new Cart(req.session.cart)
    var products = cart.generateArray()
    products.forEach(product => {
        book_id = product.item._id
        previous_owner_name = product.item.ownerName
        previous_owner_id = product.item.user
        console.log("Book to sell --> " + book_id)
        console.log("Buyer --> " + req.user.id)
        console.log("Seller --> " + previous_owner_id)
        Book.findById(book_id).then(
            book => {
                Profile.findOne({ user: req.user.id }).then(
                    buyer => {
                        Profile.findOne({ user: previous_owner_id }).then(
                            seller => {
                                if (buyer.balance < book.price) {
                                    res.json({ msg: "Not enough balance to buy" })
                                } else {
                                    buyer.balance -= book.price
                                    seller.balance += book.price
                                    for (var i = 0; i < seller.ownedBooks.length - 1; i++) {
                                        if (array[i] === book.id) {
                                            arr.splice(i, 1)
                                        }
                                    }
                                    buyer.boughtBooks.push(book.id)
                                    book.user = buyer.user
                                    book.ownerName = buyer.fullName
                                    book.save()
                                    buyer.save()
                                    seller.save()
                                    cart.reduceByOne(book_id)
                                }
                            }
                        )
                    }
                )
            }
        )
    })
    Promise.all()
        .then((result) => res.redirect("/myProfile"))
        .catch((err) => res.send(err))
})

module.exports = router


// console.log("if blog" + profile)
                    //update
