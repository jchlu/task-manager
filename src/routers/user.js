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

// READ logged in User
router.get('/users/me', async (req, res) => {
  res.json(req.taskManagerUser)
})

// UPDATE (patch) logged in User
router.patch('/users/me', async (req, res) => {
  try {
    if (!updateContainsValidFields(User, req.body)) {
      return res.status(400).json({ message: 'Not a valid update' })
    }
    const user = req.taskManagerUser
    Object.keys(req.body).forEach(update => { user[update] = req.body[update] })
    await user.save()
    res.json(user)
  } catch (error) {
    res.status(400).json(error.message)
  }
})

// DELETE logged in User
router.delete('/users/me', async (req, res) => {
  try {
    req.taskManagerUser.remove()
    res.json(req.taskManagerUser)
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

// User Logout
router.post('/users/logout', async (req, res) => {
  try {
    req.taskManagerUser.tokens = req.taskManagerUser.tokens.filter(token => token.token !== req.taskManagerToken)
    await req.taskManagerUser.save()
    res.json()
  } catch (e) {
    res.status(500).json()
  }
})

// User Logout Everywhere
router.post('/users/logout-everywhere', async (req, res) => {
  try {
    req.taskManagerUser.tokens = []
    await req.taskManagerUser.save()
    res.json()
  } catch (e) {
    res.status(500).json()
  }
})

module.exports = router
