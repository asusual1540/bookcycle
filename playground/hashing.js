const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')

//sample data
var data = {
    id: 10
}

// sample jwt.sign method
var token = jwt.sign(data, '123abc')
console.log(token)

// sample jwt.verify method
var decoded = jwt.verify(token , '123abc')
console.log(`Decoded:  ${decoded}`)


// ----manual methods for hashing----
// anyway we will use jsonwebtoken :D
// var message = 'Iam user number 3'
// var hash = SHA256(message).toString()

// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)

// var data = {
//     id: 4
// }

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'someSecret').toString()
// }
// // tempering data
// token.data.id = 5
// token.hash = SHA256(JSON.stringify(token.data)).toString()


// var resultHash = SHA256(JSON.stringify(token.data) + 'someSecret').toString()
// if(resultHash === token.hash) {
//     console.log('Data was not changed')
// } else {
//     console.log('Data was changed. Do not trust...')
// }
