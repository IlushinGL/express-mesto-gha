const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  DocumentNotFoundError,
  CastError,
  ValidationError,
} = require('mongoose').Error;
const {
  CREATED,
} = require('http-status-codes').StatusCodes;

const InternalServerError = require('../utils/errors/internal-server-err');
const ConflictError = require('../utils/errors/conflict-err');
const BadRequestError = require('../utils/errors/bad-request-err');
const NotFoundError = require('../utils/errors/not-found-err');
const UnauthorizedError = require('../utils/errors/unauthorized-err');
const { salt, secret } = require('../utils/env');
const User = require('../models/user');

const { SALT_ROUNDS = salt, JWT_SECRET = secret } = process.env;

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      next(new InternalServerError(`getAllUsers: ${err.message}`));
    });
};

module.exports.newUser = (req, res, next) => {
  bcrypt.hash(req.body.password, SALT_ROUNDS)
    .then((hash) => User.create({
      ...req.body,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send({ ...user._doc, password: undefined }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('newUser: Такой пользователь уже существует.'));
        return;
      }
      if (err instanceof ValidationError) {
        next(new BadRequestError('newUser: Переданы некорректные данные при создании пользователя.'));
        return;
      }
      next(new InternalServerError(`newUser: ${err.message}`));
    });
};

function setUser(id, data, res, next) {
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
        next(new BadRequestError('setUserProfile: Переданы некорректные данные при обновлении профиля.'));
        return;
      }
      next(new InternalServerError(`setUserProfile: ${err.message}`));
    });
}

function getUser(id, res, next) {
  User.findById(id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('getUser: Пользователь по указанному _id не найден.'));
        return;
      }
      if (err instanceof CastError) {
        next(new BadRequestError('getUser: Задан некорректный _id пользователя.'));
        return;
      }
      next(new InternalServerError(`getUser: ${err.message}`));
    });
}

module.exports.setUserProfile = (req, res, next) => {
  setUser(req.user._id, { name: req.body.name, about: req.body.about }, res, next);
};

module.exports.setUserAvatar = (req, res, next) => {
  setUser(req.user._id, { avatar: req.body.avatar }, res, next);
};

module.exports.getUserMe = (req, res, next) => {
  getUser(req.user._id, res, next);
};

module.exports.getUserById = (req, res, next) => {
  getUser(req.params.userId, res, next);
};

module.exports.login = (req, res, next) => {
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
      next(new UnauthorizedError(`login: ${err.message}`));
    });
};
