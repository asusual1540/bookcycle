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
    fullName: {
        type: String,
        required: true
    },
    status: {
        type: String,
    },
    favouriteAuthors: {
        type: [String],
        required: true,
        min: 1
    },
    favouriteBooks: {
        type: [String],
        required: true,
        min: 1
    },
    favouriteQuotes: {
        type: [String],
        max: 5
    },
    ownedBooks: {
        type: [Schema.Types.ObjectId],
        ref: "Book"
    },
    readBooks: {
        type: [Schema.Types.ObjectId],
        ref: "Book"
    },
    location: {
        type: String
    },
    social: {
        facebook: {
            type: String
        },
        google: {
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
