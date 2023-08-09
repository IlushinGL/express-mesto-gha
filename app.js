const express = require('express');
const mongoose = require('mongoose');

const routesIndex = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/', routesIndex);
app.use('/*', (req, res) => {
  res.status(404).send({ message: 'App: Неизвестный запрос.' });
});

app.listen(
  PORT,
  // () => { console.log(`Сервер запущен, порт: ${PORT}`); },
);
