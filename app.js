console.log("app started...")

const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const session = require("express-session")

const authRoutes = require("./routes/authRoutes")
const profileRoutes = require("./routes/profileRoutes")
const bookRoutes = require("./routes/bookRoutes")
const commonRoutes = require("./routes/commonRoutes")

const app = express()
const port = process.env.PORT || 3000

const { mongoose } = require("./server/db/mongoose")
mongoose.set("useCreateIndex", true)
const { User } = require("./server/models/user")
const config = require("./server/config/config")

app.use(express.static(__dirname + "/public"))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set("view engine", ejs)

app.use(session({
  secret: config.secretKey,
  resave: false,
  saveUninitialized: false
})
)

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.use(authRoutes)
app.use(profileRoutes)
app.use(commonRoutes)
app.use(bookRoutes)



app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

