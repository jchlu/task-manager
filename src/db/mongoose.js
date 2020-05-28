const mongoose = require('mongoose')
const Task = require('../models/task')
const User = require('../models/user')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager-api'

mongoose.connect(`${connectionURL}/${databaseName}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
})

const user = new User({
  name: 'Bill',
  age: 24,
  email: 'bill+goat.sausages.com'
})

user.save().then(_ => {
  console.log(user)
}).catch(e => { console.error(e.message) })
