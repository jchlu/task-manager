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
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// READ all Users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (error) {
    res.status(500).json()
  }
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

module.exports = router
