const {
  INTERNAL_SERVER_ERROR,
} = require('http-status-codes').StatusCodes;

const errorHandler = (err, req, res, next) => {
  // если у ошибки нет статуса, выставляем INTERNAL_SERVER_ERROR
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение
      message: statusCode === INTERNAL_SERVER_ERROR
        ? 'Сервер не смог обработать ошибку'
        : message,
    });
  next();
};

module.exports = errorHandler;
