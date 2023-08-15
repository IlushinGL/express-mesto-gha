const {
  FORBIDDEN,
} = require('http-status-codes').StatusCodes;

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = FORBIDDEN;
  }
}

module.exports = ForbiddenError;
