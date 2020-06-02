require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const auth = require('./middleware/auth')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const port = process.env.PORT || 3000

const app = express()
  .use(auth)
  .use(express.json())
  .use(userRouter)
  .use(taskRouter)

const multer = require('multer')
const upload = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000
  },
  fileFilter: function (request, file, callback) {
    if (!file.originalname.match(/\.(doc)x?$/)) {
      return callback(new Error('Please upload only PDF documents'))
    }
    callback(undefined, true)
  }
})

// Demo middleware throwing an error
const errorMiddleware = (request, response, next) => {
  throw new Error('This is a demo error message')
}

app.post('/upload', errorMiddleware, (request, response) => {
  response.json()
}, (e, request, response, next) => {
  response.status(400).json({ error: e.message })
})

app.listen(port, _ => {
  console.log(`Server up and running at port ${port}`)
})
