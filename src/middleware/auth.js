const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = async (req, res, next) => {
  if (req.method === 'POST' && ((req.path === '/users/login') || (req.path === '/users'))) {
    next()
  } else {
    try {
      const token = req.header('Authorization').replace('Bearer ', '')
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
      if (!user) { throw new Error() }
      console.log('Authenticated')
      req.taskManagerUser = user
      next()
    } catch (e) {
      res.status(401).json({ message: 'Please authenticate to continue' })
    }
  }
}
