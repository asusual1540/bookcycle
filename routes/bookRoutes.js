const express = require("express")
const router = express.Router()
const { Book } = require("../server/models/book")
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
    "/sell",
    isLoggedIn,
    upload,
    (req, res) => {
        var newBookname = req.body.newBookname
        var newAuthor = req.body.newAuthor
        var newPrice = req.body.newPrice
        var newImage = req.file.path
        console.log(req.file)
        if (!newBookname) {
            res.status(400).json({ message: 'Bookname was not given' })
        } else if (!newAuthor) {
            res.status(400).json({ message: 'Authorname was not given' })
        } else if (!newPrice) {
            res.status(400).json({ message: 'Provide a price for your book' })
        } else if (!newImage) {
            res.status(400).json({ message: 'Provide an image of your book' })
        } else {
            cloudinary.v2.uploader.upload(newImage,
                (err, result) => {
                    if (err) {
                        res.status(400).json({ error: err })
                    }
                    var newBook = new Book({
                        user: req.user.id,
                        name: newBookname,
                        bookImg: result.url,
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
    res.render("sell.ejs", {
        user: req.user
    })
})

module.exports = router


