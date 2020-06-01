const express = require('express')
require('../db/mongoose')
const { isValidId, updateContainsValidFields } = require('../utils/utils')
const Task = require('../models/task')

const router = express.Router()

// CREATE Task
router.post('/tasks', async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.taskManagerUser._id
  })
  try {
    await task.save()
    res.status(201).json(task)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// READ all Tasks
// GET /tasks?completed=[true|false]&limit=[int]&skip=[int]
router.get('/tasks', async (req, res) => {
  const match = {}
  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }
  try {
    await req.taskManagerUser.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip)
      }
    }).execPopulate()
    res.json(req.taskManagerUser.tasks)
  } catch (e) {
    res.status(500).json()
  }
})

// READ Task by id
router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  try {
    // Check id is valid to avoid Mongoose 500
    if (!isValidId(_id)) {
      return res.status(400).json({ message: '_id is not valid' })
    }
    const task = await Task.findOne({ _id, owner: req.taskManagerUser._id })
    if (!task) { return res.status(404).json() }
    res.json(task)
  } catch (error) {
    res.status(500).json()
  }
})

// UPDATE a Task by id
router.patch('/tasks/:id', async (req, res) => {
  try {
    if (!updateContainsValidFields(Task, req.body)) {
      return res.status(400).json({ message: 'Not a valid update' })
    }
    // Check id is valid to avoid Mongoose 500
    const _id = req.params.id
    if (!isValidId(_id)) {
      return res.status(400).json({ message: '_id is not valid' })
    }
    const task = await Task.findOne({ _id, owner: req.taskManagerUser._id })
    if (!task) { return res.status(404).json() }
    Object.keys(req.body).forEach(update => { task[update] = req.body[update] })
    await task.save()
    res.json(task)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

// DELETE Task by id
router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  try {
    // Check id is valid to avoid Mongoose 500
    if (!isValidId(_id)) {
      return res.status(400).json({ message: '_id is not valid' })
    }
    const task = await Task.findOneAndDelete({ _id, owner: req.taskManagerUser._id })
    if (!task) { return res.status(404).json() }
    res.json(task)
  } catch (error) {
    res.status(500).json()
  }
})

module.exports = router
