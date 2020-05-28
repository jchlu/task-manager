const { ObjectId, MongoClient } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
  if (error) { return console.error('Could not connect to database') }
  console.log('Connected successfully')
  const db = client.db(databaseName)
  db.collection('users').findOne({ _id: ObjectId('5ecff2b6cdb88170ea7e6f8f') }, (error, user) => {
    if (error) { return console.error(error) }
    console.log(user)
  })
})
