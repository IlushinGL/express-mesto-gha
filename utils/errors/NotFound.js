const {
  NOT_FOUND,
} = require('http-status-codes').StatusCodes;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = NOT_FOUND;
  }
}

module.exports = NotFoundError;
