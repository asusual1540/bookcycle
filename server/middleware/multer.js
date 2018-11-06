const GridFsStorage = require('multer-gridfs-storage')
const multer = require("multer")
const config = require("../config/config")
const mongoose = require("mongoose")


const connection = mongoose.connect(config.mongoURI, { useNewUrlParser: true });

const storage = new GridFsStorage({
  db: connection,
  file: (req, file) => {
    if (file.mimetype === 'image/jpeg') {
      return {
        bucketName: "photos"
      }
    } else {
      return null;
    }
  }
})

// const storage = new GridFsStorage({
//   url: config.mongoURI,

// })
const upload = multer({ storage }).single("photo")

module.exports =
  upload