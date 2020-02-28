const { BadRequest } = require('./error')

module.exports = function errorHandler (error, req, res, next) {
  let statusCode
  let message

  if (error instanceof BadRequest) {
    statusCode = error.getStatusCode()
    message = error.getMessage()
  } else {
    statusCode = 500
    message = error.message
  }

  res.status(statusCode).json({ message })
}
