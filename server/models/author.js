var mongoose = require("mongoose")
const Schema = mongoose.Schema

var AuthorSchema = new mongoose.Schema({
    name: {
        type: String
    },
    review: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            view: {
                type: String
            }
        }
    ],
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ]
})

var Author = mongoose.model("Author", AuthorSchema);
module.exports = {
    Author
}
