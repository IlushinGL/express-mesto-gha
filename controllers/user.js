const {
  DocumentNotFoundError,
  CastError,
  ValidationError,
} = require('mongoose').Error;
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  CREATED,
} = require('http-status-codes').StatusCodes;

const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: `getAllUsers: ${err.message}` });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: 'getUser: Пользователь по указанному _id не найден.' });
        return;
      }
      if (err instanceof CastError) {
        res.status(BAD_REQUEST).send({ message: 'getUser: Задан некорректный _id пользователя.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `getUser: ${err.message}` });
    });
};

module.exports.newUser = (req, res) => {
  User.create(
    req.body,
  )
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST).send({ message: 'newUser: Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `newUser: ${err.message}` });
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
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST).send({ message: 'setUserProfile: Переданы некорректные данные при обновлении профиля.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `setUserProfile: ${err.message}` });
    });
};
