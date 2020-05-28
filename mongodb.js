const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (error, client) => {
  if (error) { return console.error('Could not connect to database') }
  console.log('Connected successfully')
  const db = client.db(databaseName)
  /*  db.collection('users').insertOne({
     name: 'Johnny',
     age: 49
   }, (error, result) => {
     if (error) { return console.error('Couldn\'t insert the user') }
     console.table(result.ops)
   }) */
  /* db.collection('users').insertMany([{
    name: 'Wasif',
    age: 28
  }, {
    name: 'Zuby',
    age: 49
  }], (error, result) => {
    if (error) { return console.error('Couldn\'t insert documents') }
    console.table(result.ops)
  }) */
  /*   db.collection('tasks').insertMany([{
      name: 'Sweep balcony floor',
      completed: true
    }, {
      name: 'Make linner',
      completed: true
    }, {
      name: 'Make lunch',
      completed: false
    }], (error, result) => {
      if (error) { return console.error('Couldn\'t insert documents') }
      console.table(result.ops)
    }) */
  // id: 5ecff3c62c635c73bbc3731e
})
