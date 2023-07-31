const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

// временное решение авторизации
// ------------------------------
app.use((req, res, next) => {
  req.user = {
    _id: '64c2ef6caadb9f2e5bdeaa6f',
  };
  next();
});
// ------------------------------

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'App: Неизвестный маршрут.' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен, порт: ${PORT}`);
});
