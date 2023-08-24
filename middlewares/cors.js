const { NODE_ENV = 'develoupment' } = process.env;
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
// TODO: Подумать как вынести список в .env
const allowedCors = [
  'https://mesto.iknow.studio',
  'http://mesto.iknow.studio',
  'http://127.0.0.1:3000',
];

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { method } = req; // HTTP-метод
  const { origin } = req.headers; // источник запроса
  // список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    // указываем разрешенные типы кросс-доменных запросов
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // подтверждаем заголовки запроса
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // возвращаем ответ клиенту
    return res.end();
  }
  // проверяем режим
  if (NODE_ENV !== 'production') {
    // разрешить запросы с любого источника
    res.header('Access-Control-Allow-Origin', '*');
  } else if (allowedCors.includes(origin)) {
    // разрешить запросы с указанного источника
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
};
