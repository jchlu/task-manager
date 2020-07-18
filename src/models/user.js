const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')
const Task = require('./task')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      validate: age => {
        if (age < 0) {
          throw new Error(`Age must be a positive number, ${age} given.`)
        }
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: email => {
        if (!validator.isEmail(email)) {
          throw new Error(
            `I'm afraid ${email} doesn't validate as an email address`,
          )
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate: password => {
        if (password.toLowerCase().includes('password')) {
          throw new Error(
            'Sorry, passwords can\'t contain the string "password"',
          )
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  },
)

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
})

// Remove sensitive data before responding, using built-in toJSON method
userSchema.methods.toJSON = function () {
  const publicUser = this.toObject()
  for (const item of ['__v', 'password', 'tokens', 'avatar']) {
    delete publicUser[item]
  }
  return publicUser
}

// Generate an auth token with an instance method
userSchema.methods.generateAuthToken = async function () {
  // Normal function as requires 'this' binding
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
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

// MIDDLEWARE on save to hash passwords
userSchema.pre('save', async function (next) {
  // Must be a regular function to have 'this' binding
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

// MIDDLEWARE on remove to cascade Task deletion
userSchema.pre('remove', async function (next) {
  const user = this
  await Task.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
