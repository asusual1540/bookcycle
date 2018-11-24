const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    fullName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    status: {
        type: String,
    },
    favouriteAuthors: {
        type: [String],
        min: 1
    },
    favouriteBooks: {
        type: [String],
        min: 1
    },
    profilePic: {
        type: String,
    },
    ownedBooks: {
        type: [Schema.Types.ObjectId],
        ref: "Book"
    },
    location: {
        type: String,
    },
    balance: {
        type: Number,
    },
    rating: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            rate: {
                type: Number
            }
        }
    ],
    feedback: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            feed: {
                type: String
            }
        }
    ],
    nationalID: {
        type: String
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
