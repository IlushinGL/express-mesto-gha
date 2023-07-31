const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `getAllCards: ${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      res.status(404).send({ message: 'deleteCard: Карточка с указанным _id не найдена.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'deleteCard: Передан некорректный _id карточки.' });
        return;
      }
      res.status(500).send({ message: `deleteCard: ${err.message}` });
    });
};

module.exports.newCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'newCard: Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(500).send({ message: `newCard: ${err.message}` });
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
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      res.status(404).send({ message: 'likeCard: Передан несуществующий _id карточки.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'likeCard: Передан некорректный _id карточки.' });
        return;
      }
      res.status(500).send({ message: `likeCard: ${err.message}` });
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
    .then((card) => {
      if (card) {
        res.send({ data: card });
        return;
      }
      res.status(404).send({ message: 'dislikeCard: Передан несуществующий _id карточки.' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'dislikeCard: Передан некорректный _id карточки.' });
        return;
      }
      res.status(500).send({ message: `dislikeCard: ${err.message}` });
    });
};
