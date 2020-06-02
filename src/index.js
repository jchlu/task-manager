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
  dest: 'images'
})
app.post('/upload', upload.single('upload'), (req, res) => {
  res.send()
})

app.listen(port, _ => {
  console.log(`Server up and running at port ${port}`)
})
