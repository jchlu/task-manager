const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'Gene Hunt',
  email: 'genegenie@example.com',
  password: 'Fire up the Quattro!',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
  _id: userTwoId,
  name: 'Alex Drake',
  email: 'bollyknickers@example.com',
  password: 'Fire up the Quattro!',
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
}

const taskOne = {
  description: 'Fire up the Quattro Bols!',
  completed: false,
  owner: userOneId,
}

const taskTwo = {
  description: 'Get to the pub',
  completed: true,
  owner: userOneId,
}

const taskThree = {
  description: 'Drink Wine',
  completed: false,
  owner: userTwoId,
}

const setupDatabase = async () => {
  await User.deleteMany()
  await Task.deleteMany()
  await User(userOne).save()
  await User(userTwo).save()
  await Task(taskOne).save()
  await Task(taskTwo).save()
  await Task(taskThree).save()
}

const teardownDatabase = async () => {
  await mongoose.connection.close()
}

module.exports = {
  userOneId,
  userOne,
  userTwo,
  setupDatabase,
  teardownDatabase,
}
