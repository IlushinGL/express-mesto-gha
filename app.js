require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const {
  INTERNAL_SERVER_ERROR,
} = require('http-status-codes').StatusCodes;

const routesIndex = require('./routes/index');

const { PORT = 3000, MONGODB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGODB_URL);
app.use('/', routesIndex);

// app.use('/*', (req, res) => {
//   res.status(NOT_FOUND).send({ message: 'app: неизвестный URL' });
// });

app.listen(
  PORT,
  // () => { console.log(`Сервер запущен, порт: ${PORT}`); },
);

app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
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
});
