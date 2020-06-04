const express = require('express')
require('./db/mongoose')
const auth = require('./middleware/auth')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
  .use(auth)
  .use(express.json())
  .use(userRouter)
  .use(taskRouter)

module.exports = app
