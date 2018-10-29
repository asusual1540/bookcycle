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
const LocalStrategy = require("passport-local");

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
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(function(err, req, res, next) {
  if (err) {
    res.locals.error = err.message;
  }
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

app.get("/signup", (req, res) => {
  res.render("signup.ejs", {});
});

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
app.get("/demo", (req, res) => {
  res.send('<script>alert("Hello")</script>');
});

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

//===================================================POST-ROUTES===========================//
app.post(
  "/sell",
  isLoggedIn,
  multer(multerConfig).single("photo"),
  (req, res) => {
    var newBookname = req.body.newBookname;
    var newAuthor = req.body.newAuthor;
    var imageName = req.file.filename;
    var newImage = "/photo-storage/" + imageName;

    var newPrice = req.body.newPrice;
    var newBook = new Book({
      name: newBookname,
      bookImg: newImage,
      author: newAuthor,
      price: newPrice
    });
    Book.create(newBook, (err, freshBook) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/buy");
      }
    });
  }
);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  }),
  (req, res) => {
    res.status(400).send('<script>alert("error")</script>');
  }
);

app.post("/signup", (req, res) => {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      res.status(400).send(err.message);
      return res.render("signup.ejs");
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/");
    });
  });
});

//=============================================STARTING-APP==============================//
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// logger
// app.use((req, res, next) => {
//     var now = new Date().toString()
//     var log = `${now}: ${req.method} ${req.url} ${req.ip}`
//     console.log(log)
//     fs.appendFile('server.log', log + '\n', (err) => {
//         if(err) {
//             console.log('Unable to append to server.log')
//         }
//     })
//     next()
// })

// app.use((req, res, next) => {
//     res.render('maintenance.hbs', {
//         pageTitle: 'Site on Maintenance',
//         currentYear: new Date().getFullYear()
//     })
// })

//update a single book properties.. should be a private route
// app.patch('/books/:id', (req, res) => {
//     var id = req.params.id
//     var body = _.pick(req.body, ['name', 'author', 'price'])

//     if (!ObjectID.isValid(id)) {
//       return res.status(404).send('Invalid id')
//     }

//     Book.findByIdAndUpdate(id, {$set: body}, {new: true}).then((docs) => {
//       if (!docs) {
//         return res.status(404).send('retry')
//       }
//       res.send({docs});
//     }).catch((e) => {
//       res.status(400).send(e)
//     })
//   })

// a private route which implements authenticate function
// app.get('/users/me', authenticate, (req, res) => {
//     res.send(req.user)
// })

// Submitting a book by user
// app.post('/books', (req, res) => {
//     var book = new Book({
//         name: req.body.name,
//         author: req.body.author
//     })
//     book.save().then((result) => {
//         res.send(result)
//     }, (e) => {
//         console.log(e)
//     })
// })

// Submitting info by a user by user like signing up...should be a private route
// app.post('/users/signup', (req, res) => {
//     var body = _.pick(req.body, ['name', 'email', 'password'])
//     if (body.name && body.email && body.password) {
//         var user = new User(body)
//     } else {
//         console.log('error occured')
//     }
//     // model method (should be a custom method)
//     // User.findByToken

//     // instance method
//     // user.generateAuthToken

//     user.save().then(() => {
//         return user.generateAuthToken()
//     }).then((token) => {
//         res.header('x-auth', token).send(`You are a new user. with id: ${user.id}, name: ${user.name}, password:${user.password}`)
//     }).catch ((e) => {
//         res.send(e)
//     })
// })

// POST /users/login {email, password}
// app.post('/users/login', (req, res) => {
//     var body = _.pick(req.body, ['name', 'email', 'password']);

//     User.findByCredentials(body.email, body.password).then((user) => {
//         return user.generateAuthToken().then((token) => {
//             console.log(`Token generated: ${token}`)
//             res.header('x-auth', token).send(user);
//           });
//     }).catch((e) => {
//       res.status(400).send()
//       console.log(e)
//     });
//   });

// app.get('/categories', (req, res) => {
//     res.render('categories.hbs', {
//         // pageTitle: 'About Page',
//         // currentYear: new Date().getFullYear()
//     })
// })

// app.post('/addUser', (req, res) => {
//     var newUsername = req.body.newUsername
//     var newEmail = req.body.newEmail
//     var newPassword = req.body.newPassword
//     var newUser = new User({
//         name: newUsername,
//         email: newEmail,
//         password: newPassword
//     })
//     User.create(newUser, (err, freshUser) => {
//         if (err) {
//             console.log(err)
//         } else {
//             res.redirect('/signup')
//             console.log(freshUser)
//         }
//     })
// })
