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

app.listen(port, _ => {
  console.log(`Server up and running at port ${port}`)
})

const User = require('./models/user')
const main = async _ => {
  try {
    const user = await User.findById('5ed41e28c3fcea6a36f8a48e')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
  } catch (e) {
    console.error(e)
  }
}

main()
