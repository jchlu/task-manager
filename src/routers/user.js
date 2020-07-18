const express = require('express')
const FileType = require('file-type')
const sharp = require('sharp')
require('../db/mongoose')
const isValidId = require('../middleware/validate-id')
const isValidUpdate = require('../middleware/validate-fields')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')
const upload = require('../middleware/avatar-upload')
const User = require('../models/user')

const router = express.Router()

// CREATE User
router.post('/users', async (request, response) => {
  const user = new User(request.body)
  try {
    await user.save()
    !process.env.DEV && sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    response.status(201).json({ user, token })
  } catch (error) {
    response.status(400).json({ message: error.message })
  }
})

// READ logged in User
router.get('/users/me', async (request, response) => {
  response.json({
    user: request.taskManagerUser,
    token: request.taskManagerToken,
  })
})

// UPDATE (patch) logged in User
router.patch('/users/me', isValidUpdate, async (request, response) => {
  try {
    const user = request.taskManagerUser
    Object.keys(request.body).forEach(update => {
      user[update] = request.body[update]
    })
    await user.save()
    response.json(user)
  } catch (error) {
    response.status(400).json(error.message)
  }
})

// DELETE logged in User
router.delete('/users/me', async (request, response) => {
  try {
    await request.taskManagerUser.remove()
    !process.env.DEV &&
      sendCancellationEmail(
        request.taskManagerUser.email,
        request.taskManagerUser.name,
      )
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
    request.taskManagerUser.tokens = request.taskManagerUser.tokens.filter(
      token => token.token !== request.taskManagerToken,
    )
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

router.post(
  '/users/me/avatar',
  upload.single('avatar'),
  async (request, response) => {
    const buffer = await sharp(request.file.buffer)
      .resize({ width: 250, height: 250, fit: 'inside' })
      .png()
      .toBuffer()
    request.taskManagerUser.avatar = buffer
    await request.taskManagerUser.save()
    response.json()
  },
  (e, request, response, next) => {
    response.status(400).json({ error: e.message })
  },
)

router.delete(
  '/users/me/avatar',
  async (request, response) => {
    request.taskManagerUser.avatar = undefined
    await request.taskManagerUser.save()
    response.json()
  },
  (e, request, response, next) => {
    response.status(400).json({ error: e.message })
  },
)

router.get('/users/:id/avatar', isValidId, async (request, response) => {
  try {
    const user = await User.findById(request.params.id)
    if (!user || !user.avatar) {
      throw new Error('no user avatar found')
    }
    // grab the file type from the buffer in the db
    const fileType = await FileType.fromBuffer(user.avatar)
    // set the header
    response.set('Content-Type', fileType.mime)
    // return the image
    response.send(user.avatar)
  } catch (e) {
    response.status(404).json({ error: e.message })
  }
})

module.exports = router
