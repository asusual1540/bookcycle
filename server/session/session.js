const session = require("express-session")

//for production we need to store to mongodb
const MongoStore = require("connect-mongo")(session)
const config = require("../config/config")
const { Mongoose } = require("../db/mongoose")


module.exports = session({
    secret: config.secretKey,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: Mongoose.connection
    })
})
