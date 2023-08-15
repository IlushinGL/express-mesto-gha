const {
  CONFLICT,
} = require('http-status-codes').StatusCodes;

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = CONFLICT;
  }
}

module.exports = ConflictError;
