require('../src/db/mongoose')
const Task = require('../src/models/task')
const User = require('../src/models/user')

const taskId = '5ed03fa04d59303cf9f13d59'
const userId = '5ed043aba9daf24bb7f3bd75'

User.findByIdAndUpdate(userId, { age: 21 }).then(user => {
  console.log(user)
  return User.countDocuments({ age: 21 })
}).then(count => {
  console.log(`Count of items: ${count}`)
}).catch(e => { console.error(e.message) })

/* Task.findByIdAndDelete(taskId).then(_ => {
  return Task.countDocuments()
}).then(count => {
  console.log(`The number of tasks after deletion is ${count}`)
}).catch(e => { console.error(e.message) })
 */