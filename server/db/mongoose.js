const Mongoose = require("mongoose")
const config = require("../config/config")

Mongoose.Promise = global.Promise;
Mongoose.connect(
  config.mongoURI,
  { useNewUrlParser: true }
)


module.exports = {
  Mongoose
}
