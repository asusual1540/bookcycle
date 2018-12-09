var mongoose = require("mongoose")
const Schema = mongoose.Schema

var BookSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  ownerName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  bookImg: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  price: {
    type: Number,
    default: null,
    requierd: true,
    trim: true
  },
  language: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  condition: {
    type: Number
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ],
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
  date: {
    type: Date,
    default: Date.now
  }
})

var Book = mongoose.model("Book", BookSchema);
module.exports = {
  Book
}
