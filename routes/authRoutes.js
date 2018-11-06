const express = require("express")
const router = express.Router()
const passport = require("passport")
const { User } = require("../server/models/user")

router.post('/login', function (req, res, next) {
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

router.post("/register", (req, res) => {
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
                        email: req.body.email,
                        profilePic: ""
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


router.get("/login", (req, res) => {
    res.render("login.ejs", {})
})


router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
})

router.get("/auth/facebook", passport.authenticate("facebook"), (req, res) => {

})
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
    successRedirect: "/sell",
    failureRedirect: "/login"
}), (req, res) => {

})

module.exports = router