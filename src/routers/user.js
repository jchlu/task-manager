const express = require('express')
require('../db/mongoose')
const { isValidId, updateContainsValidFields } = require('../utils/utils')
const User = require('../models/user')

const router = express.Router()

// CREATE User
router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).json({ user, token })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// READ an Authenticated User Profile
router.get('/users/me', async (req, res) => {
  res.json(req.taskManagerUser)
})

// READ a User by id
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {
  try {
    if (!updateContainsValidFields(User, req.body)) {
      return res.status(400).json({ message: 'Not a valid update' })
    }
    const _id = req.params.id
    // Check id is valid to avoid Mongoose 500
    if (!isValidId(_id)) {
      return res.status(400).json({ message: 'That doesn\'t seem to be a valid id' })
    }
    const user = await User.findById(_id)
    Object.keys(req.body).forEach(update => { user[update] = req.body[update] })
    await user.save()
    if (!user) { return res.status(404).json() }
    res.json(user)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

// DELETE a User by id
router.delete('/users/:id', async (req, res) => {
  const _id = req.params.id
  try {
    // Check id is valid to avoid Mongoose 500
    if (!isValidId(_id)) {
      return res.status(400).json({ message: '_id is not valid' })
    }
    const user = await User.findByIdAndDelete(_id)
    if (!user) { return res.status(404).json() }
    res.json(user)
  } catch (error) {
    res.status(500).json()
  }
})

// User Login
router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()
    res.json({ user, token })
  } catch (e) {
    res.status(400).json(e)
  }
})

module.exports = router
