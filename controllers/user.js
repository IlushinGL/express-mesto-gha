const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(500).send({ message: `getAllUsers: ${err.message}` });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
        return;
      }
      res.status(404).send({ message: 'getUser: Пользователь по указанному _id не найден.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'getUser: Задан некорректный _id пользователя.' });
        return;
      }
      res.status(500).send({ message: `getUser: ${err.message}` });
    });
};

module.exports.newUser = (req, res) => {
  User.create(
    req.body,
  )
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'newUser: Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(500).send({ message: `newUser: ${err.message}` });
    });
};

module.exports.setUserProfile = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'setUserProfile: Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      res.status(500).send({ message: `setUserProfile: ${err.message}` });
    });
};
