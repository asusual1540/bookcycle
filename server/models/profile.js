const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    status: {
        type: String,
    },
    favouriteAuthors: {
        type: [String]
    },
    favouriteBooks: {
        type: [String]
    },
    favouriteQuotes: {
        type: [String]
    },
    ownedBooks: {
        type: [Schema.Types.ObjectId],
        ref: "Book"
    },
    location: {
        type: [String]
    },
    social: {
        facebook: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

var Profile = mongoose.model("Profile", ProfileSchema);
module.exports = {
    Profile
}
