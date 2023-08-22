require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./utils/errors/not-found-err');
const accessCors = require('./middlewares/cors');

const routesIndex = require('./routes/index');

const { PORT = 3000, MONGODB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGODB_URL);

app.use(requestLogger); // подключаем логгер запросов
app.use(accessCors); // подключаем обработку простых кросс запросов

app.use('/', routesIndex);
app.use('/*', (req, res, next) => {
  next(new NotFoundError('app: неизвестный URL'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
