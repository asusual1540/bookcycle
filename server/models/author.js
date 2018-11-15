var mongoose = require("mongoose")
const Schema = mongoose.Schema

var AuthorSchema = new mongoose.Schema({
    name: {
        type: String
    }
})

var Author = mongoose.model("Author", AuthorSchema);
module.exports = {
    Author
}
