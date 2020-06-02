const express = require('express')
const multer = require('multer')
require('../db/mongoose')
const { updateContainsValidFields } = require('../utils/utils')
const User = require('../models/user')

const router = express.Router()

// CREATE User
router.post('/users', async (request, response) => {
  const user = new User(request.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    response.status(201).json({ user, token })
  } catch (error) {
    response.status(400).json({ message: error.message })
  }
})

// READ logged in User
router.get('/users/me', async (request, response) => {
  response.json(request.taskManagerUser)
})

// UPDATE (patch) logged in User
router.patch('/users/me', async (request, response) => {
  try {
    if (!updateContainsValidFields(User, request.body)) {
      return response.status(400).json({ message: 'Not a valid update' })
    }
    const user = request.taskManagerUser
    Object.keys(request.body).forEach(update => { user[update] = request.body[update] })
    await user.save()
    response.json(user)
  } catch (error) {
    response.status(400).json(error.message)
  }
})

// DELETE logged in User
router.delete('/users/me', async (request, response) => {
  try {
    request.taskManagerUser.remove()
    response.json(request.taskManagerUser)
  } catch (error) {
    response.status(500).json()
  }
})

// User Login
router.post('/users/login', async (request, response) => {
  try {
    const { email, password } = request.body
    const user = await User.findByCredentials(email, password)
    const token = await user.generateAuthToken()
    response.json({ user, token })
  } catch (e) {
    response.status(400).json(e)
  }
})

// User Logout
router.post('/users/logout', async (request, response) => {
  try {
    request.taskManagerUser.tokens = request.taskManagerUser.tokens.filter(token => token.token !== request.taskManagerToken)
    await request.taskManagerUser.save()
    response.json()
  } catch (e) {
    response.status(500).json()
  }
})

// User Logout Everywhere
router.post('/users/logout-everywhere', async (request, response) => {
  try {
    request.taskManagerUser.tokens = []
    await request.taskManagerUser.save()
    response.json()
  } catch (e) {
    response.status(500).json()
  }
})

// Avatar upload
const upload = multer({
  dest: 'avatars',
  limits: {
    fileSize: 1000000
  },
  fileFilter: function (request, file, callback) {
    if (!file.originalname.match(/\.((pn)|(jp(e)?))g$/)) {
      callback(new Error('Please upload an image with a maximum size of 1MB'), undefined)
    }
    callback(undefined, true)
  }
})
router.post('/users/me/avatar', upload.single('avatar'), (request, response) => {
  response.json()
}, (e, request, response, next) => {
  response.status(400).json({ error: e.message })
})

module.exports = router
