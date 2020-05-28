const { ObjectId, MongoClient } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
  if (error) { return console.error('Could not connect to database') }
  console.log('Connected successfully')
  const db = client.db(databaseName)
  db.collection('tasks').deleteOne({
    name: 'Make lunch'
  }).then(result => {
    console.log(result.deletedCount)
  }).catch(error => {
    console.error(error)
  })
})
