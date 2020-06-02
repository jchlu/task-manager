const User = require('../models/user')
const Task = require('../models/task')

module.exports = async (request, response, next) => {
  try {
    var model = ''
    const modelInUrl = request.path.split('/')[1]
    if (modelInUrl === 'users') {
      model = User
    } else if (modelInUrl === 'tasks') {
      model = Task
    } else {
      throw new Error('Not a valid model name')
    }
    const updates = Object.keys(request.body)
    const allowedUpdates = Object.keys(model.schema.tree)
      .filter(item => !['id', '_id', '__v'].includes(item))
    if (!updates.every(update => allowedUpdates.includes(update))) {
      throw new Error('Not a valid update')
    }
    next()
  } catch (e) {
    response.status(400).json({ error: e.message })
  }
}
