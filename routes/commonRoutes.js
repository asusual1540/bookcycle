const express = require("express")
const router = express.Router()
const { Book } = require("../server/models/book")

router.get("/signup", (req, res) => {
    res.render("signup.ejs", {})
})

router.get("/privacy-policy", (req, res) => {
    res.render("privacy-policy.ejs", {})
})

// Show all books collections
router.get(
    "/books/all",
    (req, res) => {
        Book.find().then(docs => {
            res.send({ docs })
        })
    },
    err => {
        res.status(400).send(err)
    }
)

router.get("/", (req, res) => {
    res.render("index.ejs", {})
})

module.exports = router
