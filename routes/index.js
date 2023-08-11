const router = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  INTERNAL_SERVER_ERROR,
} = require('http-status-codes').StatusCodes;
const {
  newUser,
  login,
} = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // avatar: Joi.string().domain(),
  }).unknown(true),
}), newUser);

router.post('/signin', login);

router.use(auth);
router.use('/users', require('./user'));
router.use('/cards', require('./card'));

router.use(errors());
router.use((err, req, res) => {
  // если у ошибки нет статуса, выставляем INTERNAL_SERVER_ERROR
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение
      message: statusCode === INTERNAL_SERVER_ERROR
        ? 'Сервер не смог обработать ошибку'
        : message,
    });
});

module.exports = router;
