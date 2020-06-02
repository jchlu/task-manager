const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = async (request, response, next) => {
  if (request.method === 'POST' && ((request.path === '/users/login') || (request.path === '/users'))) {
    next()
  } else {
    try {
      const token = request.header('Authorization').replace('Bearer ', '')
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
      if (!user) { throw new Error() }
      console.log('Authenticated')
      request.taskManagerToken = token
      request.taskManagerUser = user
      next()
    } catch (e) {
      response.status(401).json({ message: 'Please authenticate to continue' })
    }
  }
}
