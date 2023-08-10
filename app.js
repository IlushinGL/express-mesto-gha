const express = require('express');
const mongoose = require('mongoose');
const {
  NOT_FOUND,
} = require('http-status-codes').StatusCodes;

const routesIndex = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: 'd285e3dceed844f902650f40',
  };
  next();
});

app.use('/', routesIndex);
app.use('/*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'app: неизвестный URL' });
});

app.listen(
  PORT,
  // () => { console.log(`Сервер запущен, порт: ${PORT}`); },
);
