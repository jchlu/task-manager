const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
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
    unique: true,
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
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

// Generate an auth token with an instance method
userSchema.methods.generateAuthToken = async function () {
  // Normal function as requires 'this' binding
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SALT)
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

// Check credentials with a model method
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Not able to login.')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Not able to login.')
  }
  return user
}

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
