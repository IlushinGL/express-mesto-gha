const { NODE_ENV = 'develoup' } = process.env;
const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'localhost:3000',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем режим
  if (NODE_ENV !== 'production') {
    // устанавливаем заголовок, который разрешает браузеру запросы с любого источника
    res.header('Access-Control-Allow-Origin', '*');
  } else if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
};
