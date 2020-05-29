const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const port = process.env.PORT || 3000
const app = express().use(express.json())

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

app.listen(port, _ => {
  console.log(`Server up and running at port ${port}`)
})
