var mongoose = require("mongoose")
const Schema = mongoose.Schema

var CategorySchema = new mongoose.Schema({
    name: {
        type: String
    },
    books: {
        type: [String]
    }
})

var Category = mongoose.model("Category", CategorySchema);
module.exports = {
    Category
}
