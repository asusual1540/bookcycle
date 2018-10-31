console.log("app started...");

//========================================REQUIRED MODULES=========================//
const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");
const _ = require("lodash");
const multer = require("multer");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
//=======================================STARTING-EXPRESS-APP======================//
const app = express();
var port = process.env.PORT || 3000;

//=============================================MONGOOSE=============================//
var { mongoose } = require("./server/db/mongoose");
mongoose.set("useCreateIndex", true);
var { Book } = require("./server/models/book");
var { User } = require("./server/models/user");

//=========================================MIDDLEWARE-IMPORT========================//
var { multerConfig } = require("./server/middleware/multer");

//========================================SERVING-STATIC-ASSETS=====================//
app.use(express.static(__dirname + "/public"));

//============================================BODY-PARSER===========================//
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//=================================SETTING-EJS-DYNAMIC-TEMPLATING-ENGINE============//
app.set("view engine", ejs);

//==============================================PASSPORT============================//
app.use(
  require("express-session")({
    secret: "Iamkira1540",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==================================MIDDLEWARE===============================================//
// this middleware authenticates user
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// this middle ware returns user to every routes
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});


//===============================================GET-ROUTES==========================//
app.get("/", (req, res) => {
  res.render("index.ejs", {});
});

app.get("/login", (req, res) => {
  res.render("login.ejs", {});
});

app.get("/sell", (req, res) => {
  res.render("sell.ejs", {});
});

app.get(
  "/buy",
  (req, res) => {
    Book.find().then(docs => {
      res.render("buy.ejs", {
        docs: docs
      });
    });
  },
  err => {
    res.status(400).send(err);
  }
);



// Show all books collections
app.get(
  "/books/all",
  (req, res) => {
    Book.find().then(docs => {
      res.send({ docs });
    });
  },
  err => {
    res.status(400).send(err);
  }
);

//show all Users collection
app.get(
  "/users/all",
  isLoggedIn,
  (req, res) => {
    User.find().then(docs => {
      res.send({ docs });
    });
  },
  err => {
    res.status(400).send(err);
  }
);

//show single book by attributes like here is id
app.get("/books/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Id not valid");
  }
  Book.findById(id).then(
    docs => {
      if (!docs) {
        return res.send("Incorrect id..");
      }
      res.status(200).send({ docs });
    },
    err => {
      res.status(404).send(err);
    }
  );
});

//show single user by attributes like here is id
app.get("/users/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send("Id not valid");
  }
  User.findById(id).then(
    docs => {
      if (!docs) {
        return res.send("Incorrect id..");
      }
      res.status(200).send({ docs });
    },
    err => {
      res.status(404).send(err);
    }
  );
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs", {

  })
})

//===================================================POST-ROUTES===========================//
app.post(
  "/sell",
  isLoggedIn,
  multer(multerConfig).single("photo"),
  (req, res) => {
    var newBookname = req.body.newBookname
    var newAuthor = req.body.newAuthor
    var newImage = "/photo-storage/" + imageName
    var newPrice = req.body.newPrice
    if (!newBookname) {
      res.status(400).json({ message: 'Bookname was not given' })
    } else if (!newAuthor) {
      res.status(400).json({ message: 'Authorname was not given' })
    } else if (!newPrice) {
      res.status(400).json({ message: 'Provide a price for your book' })
    } else if (!imageName) {
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
app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(400).json({ success: false, message: 'authentication failed' })
    }
    req.login(user, function (err) {
      if (err) {
        return next(err)
      }
      return res.redirect('/')
    })
  })(req, res, next)
})


app.post("/register", (req, res) => {
  username = req.body.username
  email = req.body.email
  password = req.body.password

  if (!username) {
    res.status(400).json({ message: 'Username was not given' })
  } else if (!email) {
    res.status(400).json({ message: 'Email was not given' })
  } else if (!password) {
    res.status(400).json({ message: 'Password was not given' })
  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          return res.status(400).json({ email: 'Email already exists' })
        } else {
          const newUser = new User({
            username: req.body.username,
            email: req.body.email
          })

          User.register(newUser, req.body.password, (err, user) => {
            if (err) {
              res.status(400).send(err.message)
              return res.render("signup.ejs")
            }
            passport.authenticate("local")(req, res, function () {
              res.redirect("/")
            })
          })
        }
      })
  }
})

//=============================================USE ROUTES================================//


//=============================================STARTING-APP==============================//
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

