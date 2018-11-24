const express = require("express")
const router = express.Router()
const { Book } = require("../server/models/book")
const { Author } = require("../server/models/author")
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
        var newCategory = req.body.category
        console.log(req.file)
        if (!newBookname) {
            res.status(400).json({ message: 'Bookname was not given' })
        } else if (!newAuthor) {
            res.status(400).json({ message: 'Authorname was not given' })
        } else if (!newPrice) {
            res.status(400).json({ message: 'Provide a price for your book' })
        } else if (!newImage) {
            res.status(400).json({ message: 'Provide an image of your book' })
        } else if (!newCategory) {
            res.status(400).json({ message: 'Provide an Category of your book' })
        } else {
            cloudinary.v2.uploader.upload(newImage, {
                width: 200,
                height: 332,
                crop: "fill"
            },
                (err, result) => {
                    if (err) {
                        res.status(400).json({ error: err })
                    }
                    var uniqueAuthor = new Author({
                        name: newAuthor.toLowerCase()
                    })

                    Author.findOne({ name: newAuthor.toLowerCase() })
                        .then(author => {
                            if (author) {
                                return console.log("Author by that name alrady exists in Database")
                            }
                            Author.create(uniqueAuthor, (err, result) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(result);
                                }
                            })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    var username = req.user.local.name || req.user.facebook.name || req.user.google.name
                    var newBook = new Book({
                        user: req.user.id,
                        ownerName: username,
                        name: newBookname,
                        bookImg: result.url,
                        author: newAuthor,
                        price: newPrice,
                        category: newCategory
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
            Author.find().then(author => {
                res.render("buy.ejs", {
                    docs: docs,
                    author: author
                })
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

router.get("/single-book", (req, res) => {
    res.render("single-book.ejs")
})

module.exports = router


