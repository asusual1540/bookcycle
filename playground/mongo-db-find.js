//const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/BoisellApp', {useNewUrlParser:true}, (err, database) => {
    if (err) {
        return console.log('Failed to connect Mongo database server')
    }
    console.log('mongoDB server connected')

    var db = database.db('BoisellApp')

    db.collection('Users').find({
        //dept: 'CSE'
        _id: new ObjectID('5bb204e9c45984b25fac32a0')
    }).toArray().then((docs) => {
        console.log('BoisellApp')
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log('Unable to fetch data from BoisellApp', err)
    })

    //database.close()
})