const { ObjectId, MongoClient } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
  if (error) { return console.error('Could not connect to database') }
  console.log('Connected successfully')
  const db = client.db(databaseName)
  // .find() returns a cursor, .toArray() takes a callback
  db.collection('users').find({ name: 'Johnny' }).toArray((error, users) => {
    if (error) { return console.error(error) }
    console.log(users)
  })
})
