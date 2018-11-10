console.log("app started...")
const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const ejs = require("ejs")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const Mongoose = require("mongoose")
const session = require('express-session')
const flash = require('connect-flash')

const config = require("./server/config/config")

Mongoose.connect(
  config.mongoURI,
  { useNewUrlParser: true }
)
require('./server/auth/passport')(passport)


// const authRoutes = require("./routes/authRoutes")
const OauthRoutes = require("./routes/OauthRoutes")
const profileRoutes = require("./routes/profileRoutes")
const bookRoutes = require("./routes/bookRoutes")
const commonRoutes = require("./routes/commonRoutes")

app.use(express.static(__dirname + "/public"))

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", ejs)

app.use(session({
  secret: 'Iamkira1540',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  // console.log(req)
  next()
})

// app.use(authRoutes)
app.use(profileRoutes)
app.use(commonRoutes)
app.use(bookRoutes)
app.use(OauthRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

