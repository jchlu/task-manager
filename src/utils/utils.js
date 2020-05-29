const mongoose = require('mongoose')

const updateContainsValidFields = (model, body) => {
  const updates = Object.keys(body)
  const allowedUpdates = Object.keys(model.schema.tree)
    .filter(item => !['id', '_id', '__v'].includes(item))
  return updates.every(update => allowedUpdates.includes(update))
}

const isValidId = _id => {
  return mongoose.Types.ObjectId.isValid(_id)
}

module.exports = {
  updateContainsValidFields,
  isValidId
}
