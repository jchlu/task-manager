const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    validate: age => {
      if (age < 0) {
        throw new Error(`Age must be a positive number, ${age} given.`)
      }
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: email => {
      if (!validator.isEmail(email)) {
        throw new Error(`I'm afraid ${email} doesn't validate as an email address`)
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate: password => {
      if (password.toLowerCase().includes('password')) {
        throw new Error('Sorry, paswords can\'t contain the string "password"')
      }
    }
  }
})

module.exports = User
