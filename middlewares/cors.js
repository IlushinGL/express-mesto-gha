const { mode, port, front } = require('../utils/env');

const { NODE_ENV = mode, PORT = port, FRONT_URL = front } = process.env;
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const allowedCors = [
  `http://${FRONT_URL}`,
  `https://${FRONT_URL}`,
  `http://localhost:${PORT}`,
  `https://localhost:${PORT}`,
];

// в режиме разработки можно обращаться из любого источника
if (NODE_ENV !== 'production') {
  allowedCors.push('*');
}

module.exports = (req, res, next) => {
  const { method } = req; // HTTP-метод
  const { origin } = req.headers; // источник запроса
  // список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];
  if (allowedCors.includes(origin)) {
    // разрешить запросы с указанного источника
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    // указываем разрешенные типы кросс-доменных запросов
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // подтверждаем заголовки запроса
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // возвращаем ответ клиенту
    return res.end();
  }
  return next();
};
