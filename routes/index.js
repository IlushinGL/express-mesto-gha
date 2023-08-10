const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  newUser,
  login,
} = require('../controllers/user');
const auth = require('../middlewares/auth');

router.use(errors());
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), newUser);

router.post('/signin', login);

router.use(auth);
router.use('/users', require('./user'));
router.use('/cards', require('./card'));

module.exports = router;
