const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/unauthorized-err');
const { secret } = require('../utils/env');

const { JWT_SECRET = secret } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // если токен не указан - бросаем ошибку
  if (!authorization) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  // иначе убираем лишнее
  const token = authorization.replace('Bearer ', '');
  let payload;
  // и пробуем проверить
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // если с токеном проблемы - бросаем ошибку
    next(new UnauthorizedError(err.message));
  }
  // иначе записываем пейлоуд в объект запроса
  req.user = payload;
  // и пропускаем запрос дальше
  next();
};
