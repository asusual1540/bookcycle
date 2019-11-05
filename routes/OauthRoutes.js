const express = require("express")
const router = express.Router()
const passport = require("passport")

// // PROFILE SECTION ============================================================
// router.get('/profile', isLoggedIn, function (req, res) {
//     res.render('profile.ejs', {
//         user: req.user
//     })
// })

// LOGOUT =====================================================================
router.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
})

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================
// locally ---------------------------------------------------------------------
// LOGIN =======================================================================
// show the login form =========================================================

router.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') })
})

// process the login form
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}))

// SIGNUP =====================================================================
// show the signup form =======================================================

router.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') })
})

// process the signup form

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}))

// facebook -------------------------------------------------------------------
// send to facebook to do the authentication

// router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }))

// // handle the callback after facebook has authenticated the user
// router.get('/auth/facebook/callback',
//     passport.authenticate('facebook', {
//         successRedirect: '/',
//         failureRedirect: '/login'
//     }))

// // google ----------------------------------------------------------------------

// // send to google to do the authentication
// router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// // the callback after google has authenticated the user
// router.get('/auth/google/callback',
//     passport.authenticate('google', {
//         successRedirect: '/',
//         failureRedirect: '/login'
//     }))

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

// locally --------------------------------
router.get('/connect/local', function (req, res) {
    res.render('connect-local.ejs', { message: req.flash('loginMessage') })
})
router.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect: '/', // redirect to the secure profile section
    failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}))

// facebook -------------------------------

// send to facebook to do the authentication
// router.get('/connect/facebook', passport.authorize('facebook', { scope: ['public_profile', 'email'] }))

// // handle the callback after facebook has authorized the user
// router.get('/connect/facebook/callback',
//     passport.authorize('facebook', {
//         successRedirect: '/profile',
//         failureRedirect: '/'
//     }))


// google ---------------------------------

// send to google to do the authentication
// router.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }))

// // the callback after google has authorized the user
// router.get('/connect/google/callback',
//     passport.authorize('google', {
//         successRedirect: '/profile',
//         failureRedirect: '/'
//     }))

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

// local -----------------------------------
router.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user
    user.local.email = undefined
    user.local.password = undefined
    user.save(function (err) {
        res.redirect('/profile')
    })
})

// // facebook -------------------------------
// router.get('/unlink/facebook', isLoggedIn, function (req, res) {
//     var user = req.user
//     user.facebook.token = undefined
//     user.save(function (err) {
//         res.redirect('/profile')
//     })
// })

// // google ---------------------------------
// router.get('/unlink/google', isLoggedIn, function (req, res) {
//     var user = req.user
//     user.google.token = undefined
//     user.save(function (err) {
//         res.redirect('/profile')
//     })
// })




// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next()

    res.redirect('/')
}

module.exports = router
