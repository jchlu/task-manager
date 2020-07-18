const multer = require('multer')

// Avatar upload middleware
module.exports = multer({
  // Removed to allow access to request.file: dest: 'avatars',
  limits: {
    fileSize: 1000000,
  },
  fileFilter: function (request, file, callback) {
    if (!file.originalname.match(/\.((pn)|(jp(e)?))g$/)) {
      callback(
        new Error('Please upload an image with a maximum size of 1MB'),
        undefined,
      )
    }
    callback(undefined, true)
  },
})
