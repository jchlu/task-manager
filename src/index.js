require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const auth = require('./middleware/auth')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const port = process.env.PORT

const app = express()
  .use(auth)
  .use(express.json())
  .use(userRouter)
  .use(taskRouter)

app.listen(port, _ => {
  console.log(`Server up and running at port ${port}`)
})
