const {
  BAD_REQUEST,
} = require('http-status-codes').StatusCodes;

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = BadRequestError;
