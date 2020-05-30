const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
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
        throw new Error('Sorry, passwords can\'t contain the string "password"')
      }
    }
  }
})

// MIDDLEWARE
userSchema.pre('save', async function (next) {
  // Must be a regular function to have 'this' binding
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  if (user.isModified('name')) {
    console.log('Name modified')
  }
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
