const {
  DocumentNotFoundError,
  CastError,
  ValidationError,
} = require('mongoose').Error;
const {
  CREATED,
} = require('http-status-codes').StatusCodes;

const InternalServerError = require('../utils/errors/internal-server-err');
const ForbiddenError = require('../utils/errors/forbidden-err');
const BadRequestError = require('../utils/errors/bad-request-err');
const NotFoundError = require('../utils/errors/not-found-err');

const Card = require('../models/card');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(new InternalServerError(`getAllCards: ${err.message}`));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      if (String(card.owner) !== req.user._id) {
        next(new ForbiddenError('deleteCard: Удаление чужой карточки запрещено.'));
        return;
      }
      Card.deleteOne(card)
        .then((data) => {
          res.send({ data });
        })
        .catch((err) => {
          next(new InternalServerError(`deleteCard: ${err.message}`));
        });
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError('deleteCard: Карточка с указанным _id не найдена.'));
        return;
      }
      if (err instanceof CastError) {
        next(new BadRequestError('deleteCard: Передан некорректный _id карточки.'));
        return;
      }
      next(new InternalServerError(`deleteCard: ${err.message}`));
    });
};

module.exports.newCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('newCard: Переданы некорректные данные при создании карточки.'));
        return;
      }
      next(new InternalServerError(`newCard: ${err.message}`));
    });
};

module.exports.likeCard = (req, res, next) => {
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
        next(new NotFoundError('likeCard: Карточка с указанным _id не найдена.'));
        return;
      }
      if (err instanceof CastError) {
        next(new BadRequestError('likeCard: Передан некорректный _id карточки.'));
        return;
      }
      next(new InternalServerError(`likeCard: ${err.message}`));
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
        next(new NotFoundError('dislikeCard: Карточка с указанным _id не найдена.'));
        return;
      }
      if (err instanceof CastError) {
        next(new BadRequestError('dislikeCard: Передан некорректный _id карточки.'));
        return;
      }
      next(new InternalServerError(`dislikeCard: ${err.message}`));
    });
};
