require('../src/db/mongoose')
const Task = require('../src/models/task')

const _id = '5ed03fa04d59303cf9f13d59'

Task.findByIdAndDelete(_id).then(_ => {
  return Task.countDocuments()
}).then(count => {
  console.log(`The number of tasks after deletion is ${count}`)
}).catch(e => { console.error(e.message) })
