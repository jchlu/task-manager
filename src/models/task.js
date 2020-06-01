const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
})

/*
// MIDDLEWARE
taskSchema.pre('save', async function (next) {
  // Must be a regular function to have 'this' binding
  const task = this
  // Do stuff on task
  next()
})
 */

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
