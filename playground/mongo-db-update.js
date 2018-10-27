//const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/BoisellApp', {useNewUrlParser:true}, (err, database) => {
    if (err) {
        return console.log('Failed to connect Mongo database server')
    }
    console.log('mongoDB server connected')

    var db = database.db('BoisellApp')

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5bb20528c45984b25fac32ac')
    }, {
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    },).then((result) => {
        console.log(result)
    })

    db.collection('Users').find().toArray().then((result) => {
        console.log('BoisellApp')
        console.log(JSON.stringify(result, undefined, 2))
    },(err) => {
        console.log('Unable to find all the data')
    })

    //database.close()
})