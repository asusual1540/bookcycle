const express = require("express")
const router = express.Router()
const { Book } = require("../server/models/book")
const { Author } = require("../server/models/author")
const { Category } = require("../server/models/category")
const { Profile } = require("../server/models/profile")
const Cart = require("../server/models/cart")
const upload = require("../server/middleware/multer")
const cloudinary = require('cloudinary')
const ObjectID = require('mongodb').ObjectID

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



function more_like_this(id) {
    var related_books = []
    Book.find({ _id: id })
        .then(book => {
            if (book) {
                Book.find({ language: language })
                    .then(books => {
                        related_books.push(...books)
                    })
                Book.find({ category: category })
                    .then(books => {
                        related_books.push(...books)
                    })
                Book.find({ author: author })
                    .then(books => {
                        related_books.push(...books)
                    })
            } else {
                console.log("else blck ran")
            }
        })
    return related_books
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
        var language = req.body.language
        var newCategory = req.body.category
        if (!newBookname) {
            res.status(400).json({ message: 'Bookname was not given' })
        } else if (!newAuthor) {
            res.status(400).json({ message: 'Authorname was not given' })
        } else if (!newPrice) {
            res.status(400).json({ message: 'Provide a price for your book' })
        } else if (!newImage) {
            res.status(400).json({ message: 'Provide an image of your book' })
        } else {
            cloudinary.v2.uploader.upload(newImage, {
                width: 300,
                height: 480,
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
                                return console.log("Author by that name already exists in Database")
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
                    var uniqueCategory = new Category({
                        name: newCategory.toLowerCase(),
                        books: newBookname.toLowerCase()
                    })
                    Category.findOne({ name: newCategory.toLowerCase() })
                        .then(category => {
                            if (category) {
                                return console.log("Category by that name already exists in Database")
                            }
                            Category.create(uniqueCategory, (err, result) => {
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
                    var linkedProfile
                    Profile.findOne({ user: req.user.id }).then(
                        profile => {
                            if (profile) {
                                linkedProfile = profile
                                console.log("PROFILE" + linkedProfile)
                            }
                            else {
                                console.log("no profile assigned")
                            }
                        }
                    )
                    var newBook = new Book({
                        user: req.user.id,
                        // userProfile: linkedProfile.id,
                        ownerName: username,
                        name: newBookname.toLowerCase(),
                        bookImg: result.url,
                        author: newAuthor,
                        price: newPrice,
                        language: language,
                        category: newCategory
                    })
                    Book.create(newBook, (err, freshBook) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("FRESHBOOK" + freshBook)
                            res.redirect("/buy");
                        }
                    })
                })
        }
    }
)



//show single book by attributes like here is id
router.get("/book/:id", (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid")
    }

    var related_books = []
    var books = []
    Book.findById(id).then(
        book => {
            if (!book) {
                return res.send("Incorrect id..")
            }
            Book.find({ $or: [{ 'author': book.author }, { 'category': book.category }, { 'language': book.language }] }).then(
                related => {
                    if (related) {
                        related_books = related
                    }
                    Book.find({ $and: [{ 'author': book.author }, { 'name': book.name }] }).then(
                        _books => {
                            if (_books) {
                                books = _books
                            }
                            Profile.findOne({ user: req.user.id })
                                .then(
                                    profile => {
                                        res.render("single-book.ejs", {
                                            book: book,
                                            books: books,
                                            related_books: related_books,
                                            profile: profile
                                        })
                                    }
                                )
                        })
                })

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
                Category.find().then(cat => {
                    res.render("buy.ejs", {
                        docs: docs,
                        author: author,
                        cat: cat
                    })
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


router.post("/book/like/:id", (req, res) => {
    var id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send("Id not valid")
    }

    Book.findById(id).then(
        book => {
            if (!book) {
                return res.send("Incorrect id..")
            }
            Book.find({ $and: [{ 'author': book.author }, { 'name': book.name }] }).then(
                _books => {
                    _books.forEach(item => {
                        item.likes.push(req.user.id)
                    })
                })
            no_of_likes = book.likes.length
            console.log(no_of_likes)
        }
    )
})

router.get("/add-to-cart/:id", (req, res) => {
    var productId = req.params.id
    var cart = new Cart(req.session.cart ? req.session.cart : {})

    Book.findById(productId).then(
        book => {
            if (!book) {
                res.json({ msg: "no book" })
            }
            cart.add(book, book.id)
            req.session.cart = cart
            console.log(req.session.cart)
            res.redirect("/")
        }
    )
})

router.get("/cart", (req, res) => {
    res.render("cart.ejs")
})


module.exports = router


