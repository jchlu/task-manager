const mongoose = require('mongoose')
// const Task = require('../models/task')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager-api'

mongoose.connect(`${connectionURL}/${databaseName}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
/*
const Model = mongoose.model('Test', {
  name: { type: String, required: true },
  age: { type: Number, required: true }
})

console.log(Object.keys(Task.schema.tree).filter(item => { return !['id', '_id', '__v'].includes(item) }))

const test = async (model, data) => {
  try {
    await model.validate(data)
  } catch (err) {
    console.log(err instanceof mongoose.Error.ValidationError)
    console.log(Object.keys(err.errors)) // ['name']
  }
}
test(Task, { description: 'null' })
 */
