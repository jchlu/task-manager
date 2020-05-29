const express = require('express')
require('./db/mongoose')
const { isValidId, updateContainsValidFields } = require('./utils/utils')
const User = require('./models/user')
const Task = require('./models/task')

const port = process.env.PORT || 3000
const app = express().use(express.json())

// CREATE User
app.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// READ all Users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (error) {
    res.status(500).json()
  }
})

// READ a User by id
app.get('/users/:id', async (req, res) => {
  const _id = req.params.id
  try {
    // Check id is valid to avoid Mongoose 500
    if (!isValidId(_id)) {
      return res.status(400).json({ message: '_id is not valid' })
    }
    const user = await User.findById(_id)
    if (!user) { return res.status(404).json() }
    res.json(user)
  } catch (error) {
    res.status(500).json()
  }
})

// UPDATE (patch) a User by id
app.patch('/users/:id', async (req, res) => {
  try {
    if (!updateContainsValidFields(User, req.body)) {
      return res.status(400).json({ message: 'Not a valid update' })
    }
    const _id = req.params.id
    // Check id is valid to avoid Mongoose 500
    if (!isValidId(_id)) {
      return res.status(400).json({ message: 'That doesn\'t seem to be a valid id' })
    }
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
    if (!user) { return res.status(404).json() }
    res.json(user)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

// CREATE Task
app.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
    await task.save()
    res.status(201).json(task)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// READ all Tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.json(tasks)
  } catch (error) {
    res.status(500).json()
  }
})

// READ Task by id
app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  try {
    // Check id is valid to avoid Mongoose 500
    if (!isValidId(_id)) {
      return res.status(400).json({ message: '_id is not valid' })
    }
    const task = await Task.findById(_id)
    if (!task) { return res.status(404).json() }
    res.json(task)
  } catch (error) {
    res.status(500).json()
  }
})

// UPDATE a Task by id
app.patch('/tasks/:id', async (req, res) => {
  try {
    if (!updateContainsValidFields(Task, req.body)) {
      return res.status(400).json({ message: 'Not a valid update' })
    }
    // Check id is valid to avoid Mongoose 500
    const _id = req.params.id
    if (!isValidId(_id)) {
      return res.status(400).json({ message: '_id is not valid' })
    }
    const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
    if (!task) { return res.status(404).json() }
    res.json(task)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

app.listen(port, _ => {
  console.log(`Server up and running at port ${port}`)
})
