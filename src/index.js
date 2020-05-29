const express = require('express')
const mongoose = require('mongoose')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const port = process.env.PORT || 3000
const app = express().use(express.json())

// CREATE User
app.post('/users', (req, res) => {
  const user = new User(req.body)
  user.save()
    .then(_ => {
      res.status(201).json(user)
    })
    .catch(e => {
      res.status(400).json({ message: e.message })
    })
})

// CREATE Task
app.post('/tasks', (req, res) => {
  const task = new Task(req.body)
  task.save()
    .then(_ => {
      res.status(201).json(task)
    })
    .catch(e => {
      res.status(400).json({ message: e.message })
    })
})

// READ all Users
app.get('/users', (req, res) => {
  User.find({})
    .then(users => {
      res.json(users)
    })
    .catch(e => {
      res.status(500).json()
    })
})

// READ a User by id
app.get('/users/:id', (req, res) => {
  const _id = req.params.id
  // Check id is valid to avoid Mongoose 500
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: '_id is not valid' })
  }
  User.findById(_id)
    .then(user => {
      console.log(`User from findById is: ${user}`)
      if (!user) { return res.status(404).json() }
      res.json(user)
    })
    .catch(e => {
      res.status(500).json()
    })
})

// READ all Tasks
app.get('/tasks', (req, res) => {
  Task.find({})
    .then(tasks => {
      res.json(tasks)
    })
    .catch(e => {
      res.status(500).json()
    })
})

// READ Task by id
app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id
  // Check id is valid to avoid Mongoose 500
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: '_id is not valid' })
  }
  Task.findById(_id)
    .then(task => {
      if (!task) { return res.status(404).json() }
      res.json(task)
    })
    .catch(e => {
      res.status(500).json()
    })
})

app.listen(port, _ => {
  console.log(`Server up and running at port ${port}`)
})
