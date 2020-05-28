const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
  if (error) { return console.error('Could not connect to database') }
  console.log('Connected successfully')
  const db = client.db(databaseName)
  db.collection('users').findOne({ name: 'Wasif' }, (error, user) => {
    if (error) { return console.error(error) }
    console.log(user)
  })
})
