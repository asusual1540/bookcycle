var mongoose = require("mongoose");
const _ = require("lodash");

var BookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  bookImg: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
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
  }
});

BookSchema.methods.toJSON = function() {
  var book = this;
  var bookObject = book.toObject();

  return _.pick(bookObject, ["_id", "name", "author", "bookImg", "price"]);
};

var Book = mongoose.model("Book", BookSchema);
module.exports = {
  Book
};
