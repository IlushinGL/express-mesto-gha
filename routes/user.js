const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers,
  getUser,
  setUserProfile,
  setUserAvatar,
} = require('../controllers/user');

const validUrl = require('../utils/validators');

router.get('/', getAllUsers);
router.get('/:userId', celebrate({
  // валидируем параметр
  params: Joi.object().keys({
    userId: Joi.string().alphanum().required(),
  }),
}), getUser);
// router.get('/me', getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), setUserProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(validUrl()),
  }).unknown(true),
}), setUserAvatar);

module.exports = router;
