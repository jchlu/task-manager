const express = require('express')
require('../db/mongoose')
const isValidId = require('../middleware/validate-id')
const isValidUpdate = require('../middleware/validate-fields')
const Task = require('../models/task')

const router = express.Router()

// CREATE Task
router.post('/tasks', async (request, response) => {
  const task = new Task({
    ...request.body,
    owner: request.taskManagerUser._id
  })
  try {
    await task.save()
    response.status(201).json(task)
  } catch (error) {
    response.status(400).json({ message: error.message })
  }
})

// READ all Tasks
// GET /tasks?completed=[true|false]&limit=[int]&skip=[int]
// GET /tasks?sortBy=[createdAt|updatedAt|completed]:[asc|desc]
router.get('/tasks', async (request, response) => {
  const match = {}
  const sort = {}
  if (request.query.completed) {
    match.completed = request.query.completed === 'true'
  }
  if (request.query.sortBy) {
    const parts = request.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
  try {
    await request.taskManagerUser.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(request.query.limit),
        skip: parseInt(request.query.skip),
        sort
      }
    }).execPopulate()
    response.json(request.taskManagerUser.tasks)
  } catch (e) {
    response.status(500).json()
  }
})

// READ Task by id
router.get('/tasks/:id', isValidId, async (request, response) => {
  const _id = request.params.id
  try {
    const task = await Task.findOne({ _id, owner: request.taskManagerUser._id })
    if (!task) { return response.status(404).json() }
    response.json(task)
  } catch (error) {
    response.status(500).json()
  }
})

// UPDATE a Task by id
router.patch('/tasks/:id', isValidId, isValidUpdate, async (request, response) => {
  try {
    const task = await Task.findOne({ _id: request.params.id, owner: request.taskManagerUser._id })
    if (!task) { return response.status(404).json() }
    Object.keys(request.body).forEach(update => { task[update] = request.body[update] })
    await task.save()
    response.json(task)
  } catch (error) {
    response.status(400).json(error.message)
  }
})

// DELETE Task by id
router.delete('/tasks/:id', async (request, response) => {
  const _id = request.params.id
  try {
    // Check id is valid to avoid Mongoose 500
    if (!isValidId(_id)) {
      return response.status(400).json({ message: '_id is not valid' })
    }
    const task = await Task.findOneAndDelete({ _id, owner: request.taskManagerUser._id })
    if (!task) { return response.status(404).json() }
    response.json(task)
  } catch (error) {
    response.status(500).json()
  }
})

module.exports = router
