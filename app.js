const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

// временное решение авторизации
// ------------------------------
app.use((req, res, next) => {
  req.user = {
    _id: '64c7ff9b419fbf323649a304',
  };
  next();
});
// ------------------------------

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'App: Неизвестный запрос.' });
});

app.listen(
  PORT,
  // () => { console.log(`Сервер запущен, порт: ${PORT}`); },
);
