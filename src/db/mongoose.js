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
  name: 'Snorker',
  age: 26,
  email: 'snorker@sausages.com      ',
  password: 'My n3w Pa55w0rd! dot com'
})

/* user.save().then(_ => {
  console.log(user)
}).catch(e => { console.error(e.message) })
 */
const task = new Task({
  description: '     Grab a beer!   '
})

/* task.save().then(_ => {
  console.log(task)
}).catch(e => { console.error(e.message) })
 */