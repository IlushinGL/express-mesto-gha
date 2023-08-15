require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const NotFoundError = require('./utils/errors/NotFound');

const routesIndex = require('./routes/index');

const { PORT = 3000, MONGODB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGODB_URL);

app.use('/', routesIndex);
app.use('/*', (req, res, next) => {
  next(new NotFoundError('app: неизвестный URL'));
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
