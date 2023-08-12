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
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  CREATED,
} = require('http-status-codes').StatusCodes;

const { SALT_ROUNDS = 8, JWT_SECRET = 'secret_key' } = process.env;
const User = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: `getAllUsers: ${err.message}` });
    });
};

module.exports.newUser = (req, res) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({
      ...req.body,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send({ ...user._doc, password: undefined }))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(CONFLICT).send({ message: 'newUser: Такой пользователь уже существует.' });
        return;
      }
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

function getUser(id, res) {
  User.findById(id)
    .orFail()
    .then((user) => {
      res.send(user);
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
}

module.exports.setUserProfile = (req, res) => {
  setUser(req.user._id, { name: req.body.name, about: req.body.about }, res);
};

module.exports.setUserAvatar = (req, res) => {
  setUser(req.user._id, { avatar: req.body.avatar }, res);
};

module.exports.getUserMe = (req, res) => {
  getUser(req.user._id, res);
};

module.exports.getUserById = (req, res) => {
  getUser(req.params.userId, res);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
    // аутентификация успешна, пользователь в переменной user
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
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
