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

const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: `getAllCards: ${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: 'deleteCard: Карточка с указанным _id не найдена.' });
        return;
      }
      if (err instanceof CastError) {
        res.status(BAD_REQUEST).send({ message: 'deleteCard: Передан некорректный _id карточки.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `deleteCard: ${err.message}` });
    });
};

module.exports.newCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res.status(BAD_REQUEST).send({ message: 'newCard: Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `newCard: ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: 'likeCard: Карточка с указанным _id не найдена.' });
        return;
      }
      if (err instanceof CastError) {
        res.status(BAD_REQUEST).send({ message: 'likeCard: Передан некорректный _id карточки.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `likeCard: ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
    },
  )
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        res.status(NOT_FOUND).send({ message: 'dislikeCard: Карточка с указанным _id не найдена.' });
        return;
      }
      if (err instanceof CastError) {
        res.status(BAD_REQUEST).send({ message: 'dislikeCard: Передан некорректный _id карточки.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: `dislikeCard: ${err.message}` });
    });
};
