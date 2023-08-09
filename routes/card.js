const router = require('express').Router();
const {
  getAllCards,
  deleteCard,
  newCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');
const auth = require('../middlewares/auth');

router.use(auth);
router.get('/', getAllCards);
router.post('/', newCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
