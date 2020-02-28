class BadRequest extends Error {
  constructor (message) {
    super(message)
    this.statusCode = 400
    this.message = message
  }

  getStatusCode () {
    return this.statusCode
  }

  getMessage () {
    return this.message
  }
}

module.exports = BadRequest
