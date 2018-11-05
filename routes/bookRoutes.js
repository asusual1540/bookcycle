const express = require("express")
const router = express.Router()
const { Book } = require("../server/models/book")
const multer = require("multer")
const { multerConfig } = require("../server/middleware/multer")

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}

router.post(
    "/sell",
    // isLoggedIn,
    multer(multerConfig).single("photo"),
    (req, res) => {
        var newBookname = req.body.newBookname
        var newAuthor = req.body.newAuthor
        var newImage = "./public/photo-storage/" + imageName
        var newPrice = req.body.newPrice
        if (!newBookname) {
            res.status(400).json({ message: 'Bookname was not given' })
        } else if (!newAuthor) {
            res.status(400).json({ message: 'Authorname was not given' })
        } else if (!newPrice) {
            res.status(400).json({ message: 'Provide a price for your book' })
        } else if (!newImage) {
            res.status(400).json({ message: 'Provide an image of your book' })
        } else {
            var imageName = req.file.filename
            var newBook = new Book({
                name: newBookname,
                bookImg: newImage,
                author: newAuthor,
                price: newPrice
            })

            Book.create(newBook, (err, freshBook) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/buy");
                }
            })
        }
    }
)

//show single book by attributes like here is id
router.get("/books/:id", (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid")
    }
    Book.findById(id).then(
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
    "/buy",
    (req, res) => {
        Book.find().then(docs => {
            res.render("buy.ejs", {
                docs: docs
            })
        })
    },
    err => {
        res.status(400).send(err)
    }
)

router.get("/sell", (req, res) => {
    res.render("sell.ejs", {})
})

module.exports = router