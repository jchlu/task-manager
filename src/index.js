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
    if (!file.originalname.endsWith('.pdf')) {
      return callback(new Error('Please upload only PDF documents'))
    }
    callback(undefined, true)
  }
})

app.post('/upload', upload.single('upload'), (request, response) => {
  response.json()
})

app.listen(port, _ => {
  console.log(`Server up and running at port ${port}`)
})
