const mongoose = require('mongoose')

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    validate: age => {
      if (age < 0) {
        throw new Error(`Age must be a positive number, ${age} given.`)
      }
    }
  }
})

module.exports = User
