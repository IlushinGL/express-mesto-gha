const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  DocumentNotFoundError,
  CastError,
  ValidationError,
} = require('mongoose').Error;
const {
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  CREATED,
} = require('http-status-codes').StatusCodes;

const { soulLenght, secretKey } = require('../utils/constants');
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
  bcrypt.hash(req.body.password, soulLenght)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST).send({ message: 'newUser: Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `newUser: ${err.message}` });
    });
};

function setUser(id, data, res) {
  User.findByIdAndUpdate(
    id,
    data,
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
}

module.exports.setUserProfile = (req, res) => {
  setUser(req.user._id, { name: req.body.name, about: req.body.about }, res);
};

module.exports.setUserAvatar = (req, res) => {
  setUser(req.user._id, { avatar: req.body.avatar }, res);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password).select('+password')
    // .then((user) => {
    // аутентификация успешна, пользователь в переменной user
    .then(() => {
      const token = jwt.sign(
        // { _id: user._id },
        // токен создаётся для хардкордного _id
        { _id: 'd285e3dceed844f902650f40' },
        secretKey,
        // токен будет просрочен через неделю после создания
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(UNAUTHORIZED)
        .send({ message: err.message });
    });
};
