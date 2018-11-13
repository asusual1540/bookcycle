var mongoose = require("mongoose")
const Schema = mongoose.Schema

var BookSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
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
    type: String,
    default: null,
    requierd: true,
    trim: true
  },
  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      text: {
        type: String,
        required: true
      },
      likes: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User"
          }
        }
      ],
      comments: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User"
          },
          text: {
            type: String
          },
          date: {
            type: Date,
            default: Date.now
          }
        }
      ]
    }
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User"
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
