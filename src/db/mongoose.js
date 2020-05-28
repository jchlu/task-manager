const mongoose = require('mongoose')
const Task = require('../models/task')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager-api'

mongoose.connect(`${connectionURL}/${databaseName}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
})

const drink = new Task({
  description: 'Drink an ice cold Presidente',
  completed: 'false'
})

drink.save().then(_ => {
  console.log(drink)
}).catch(e => {
  console.error(e.message)
})
