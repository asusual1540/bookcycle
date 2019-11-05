console.log("app started...")
const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const ejs = require("ejs")
// const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const Mongoose = require("mongoose")
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')(session)

const OauthRoutes = require("./routes/OauthRoutes")
const profileRoutes = require("./routes/profileRoutes")
const bookRoutes = require("./routes/bookRoutes")
const commonRoutes = require("./routes/commonRoutes")

const config = require("./server/config/config")

Mongoose.Promise = global.Promise
Mongoose.connect(
  config.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
require('./server/auth/passport')(passport)


app.use(express.static(__dirname + "/public"))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", ejs)

app.use(session({
  secret: config.secretKey,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: Mongoose.connection }),
  cookie: { maxAge: 60 * 60 * 1000 }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.session = req.session
  res.locals.data = null
  next()
})

app.use(profileRoutes)
app.use(commonRoutes)
app.use(bookRoutes)
app.use(OauthRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

