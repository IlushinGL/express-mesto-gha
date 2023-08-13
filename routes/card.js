const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllCards,
  deleteCard,
  newCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');

const validUrl = require('../utils/validators');

router.get('/', getAllCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(validUrl()),
  }).unknown(true),
}), newCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
