const {
  INTERNAL_SERVER_ERROR,
} = require('http-status-codes').StatusCodes;

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InternalServerError';
    this.statusCode = INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;
