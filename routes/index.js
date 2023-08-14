const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  newUser,
  login,
} = require('../controllers/user');
const validUrl = require('../utils/validators');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(validUrl()),
  }).unknown(true),
}), newUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }).unknown(true),
}), login);

router.use('/users', auth, require('./user'));
router.use('/cards', auth, require('./card'));

module.exports = router;
