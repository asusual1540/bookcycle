const express = require("express")
const router = express.Router()
const { Book } = require("../server/models/book")
const { Author } = require("../server/models/author")
const { Category } = require("../server/models/category")


// router.get("/signup", (req, res) => {
//     res.render("signup.ejs", {})
// })

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
    Book.find().then(docs => {
        res.render("index.ejs", { docs })
    })
})

router.post("/search", (req, res) => {
    var input = req.body.input
    console.log(input)
    Book.find({ $or: [{ 'author': input }, { 'name': input }, { 'category': input }] }).then(docs => {
        Author.find().then(author => {
            Category.find().then(cat => {
                res.render("buy.ejs", {
                    docs: docs,
                    author: author,
                    cat: cat,
                    input: input
                })
            })
        })
    })
})

module.exports = router


