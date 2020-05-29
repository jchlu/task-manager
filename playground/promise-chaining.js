require('../src/db/mongoose')
const Task = require('../src/models/task')
const User = require('../src/models/user')

const taskId = '5ed13fa7b6f2fdc0ab40c470'
const userId = '5ed043aba9daf24bb7f3bd75'

const updateAgeAndReturnCount = async (userId, age) => {
  await User.findByIdAndUpdate(userId, { age })
  const count = await User.countDocuments({ age })
  return { age, count }
}

updateAgeAndReturnCount(userId, 21).then(({ age, count }) => {
  console.log(`Count of items with the age ${age}: ${count}`)
}).catch(e => { console.error(e.message) })

const del = async id => {
  await Task.findByIdAndDelete(id)
  const count = Task.countDocuments({ completed: false })
  return count
}

del(taskId).then(count => {
  console.log(`The number of tasks after deletion is ${count}`)
}).catch(e => { console.error(e.message) })

/* User.findByIdAndUpdate(userId, { age: 21 }).then(user => {
  console.log(user)
  return User.countDocuments({ age: 21 })
}).then(count => {
  console.log(`Count of items: ${count}`)
}).catch(e => { console.error(e.message) }) */

/* Task.findByIdAndDelete(taskId).then(_ => {
  return Task.countDocuments()
}).then(count => {
  console.log(`The number of tasks after deletion is ${count}`)
}).catch(e => { console.error(e.message) })
 */
