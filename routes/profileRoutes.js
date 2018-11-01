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

router.get("/users", passport.authenticate("local", (req, res) => {
    res.json({ user: req.user.username })
})
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