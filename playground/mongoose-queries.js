const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Book} = require('./../server/models/book')
const {User} = require('./../server/models/user')



var id = '5bb239030d91ce060854d84a'

if (!ObjectID.isValid (id)) {
     return console.log ('Id not valid!!')
}

// Book.find({
//     _id: id
// }).then((docs) => {
//     if(docs.length <= 0) {
//         return console.log('Id not found in the database')
//     }
//     console.log('Books: ', docs)
// })

// Book.findOne({
//     _id: id
// }).then((docs) => {
//     if(!docs) {
//         return console.log('Id not found in the database')
//     }
//     console.log('Books', docs)
// })

// Book.findById(id).then((docs) => {
//     if(!docs) {
//         return console.log('Id not found in the database')
//     }
//     console.log('Book by id: ', docs)
// }).catch ((err) => {
//     console.log(err)
// })

User.findById(id).then((docs) => {
    if(!docs) {
        return console.log('No user found by that id..')
    }
    console.log('User: ', docs)
}, (err) => {
    console.log('err: ', err)
})