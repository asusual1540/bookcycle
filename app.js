console.log("app started...")

const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const app = express()

const authRoutes = require("./routes/authRoutes")
const profileRoutes = require("./routes/profileRoutes")
const bookRoutes = require("./routes/bookRoutes")
const commonRoutes = require("./routes/commonRoutes")
const session = require("./server/session/session")

app.use(express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
require("./server/auth/facebook-auth")()
require("./server/auth/local-auth")()
app.use(session)
app.use(passport.initialize())
app.use(passport.session())


const { Mongoose } = require("./server/db/mongoose")
Mongoose.set("useCreateIndex", true)
const { User } = require("./server/models/user")
app.set("view engine", ejs)


app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.use(authRoutes)
app.use(profileRoutes)
app.use(commonRoutes)
app.use(bookRoutes)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

