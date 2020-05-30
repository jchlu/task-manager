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
