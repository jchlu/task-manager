require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const port = process.env.PORT || 3000

const app = express()
  .use(express.json())
  .use(userRouter)
  .use(taskRouter)

app.listen(port, _ => {
  console.log(`Server up and running at port ${port}`)
})

/*
const jwt = require('jsonwebtoken')

const myFunction = async _ => {
  try {
    const token = jwt.sign({ _id: '5ed03ac4a3f01e29ca7f3263' }, process.env.JWT_SALT)
    console.log(token)
  } catch (e) {
    console.error(e)
  }
}

myFunction()
 */
