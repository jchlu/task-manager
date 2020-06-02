const mongoose = require('mongoose')

// Middleware to validate id
module.exports = async (request, response, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      throw new Error('invalid id')
    }
    next()
  } catch (e) {
    response.status(400).json({ message: e.message })
  }
}
