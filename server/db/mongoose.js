var mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://adnan:adnan1540@ds141813.mlab.com:41813/bookcycle', {useNewUrlParser:true})
//'mongodb://adnan:Iamkira1540@ds221003.mlab.com:21003/book-sell' || 
//mongodb://localhost:27017/BoiSellApp
//mongodb://adnan:adnan1540@ds221003.mlab.com:21003/book-sell
module.exports = {
    mongoose
}