const mongoose = require('mongoose')
const connectionURL = process.env.MONGODB_CONNECTION_URL
const databaseName = process.env.MONGODB_DATABASE

mongoose.connect(`${connectionURL}/${databaseName}`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
