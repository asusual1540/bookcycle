const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/BoisellApp', {useNewUrlParser:true}, (err, database) => {
    if (err) {
        return console.log('Failed to connect Mongo database server')
    }
    console.log('mongoDB server connected')

    var db = database.db('BoisellApp')

    db.collection('Users').insertOne({
        name: 'Abu Zayed',
        age: 21,
        dept: 'CSE'
    }, (err, result) => {
        if (err){
            return console.log('Unable to insert data to Users', err)
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
    })

    database.close()
})