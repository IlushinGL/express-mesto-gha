const router = require('express').Router();
const {
  newUser,
  login,
} = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/signup', newUser);
router.post('/signin', login);

router.use(auth);
router.use('/users', require('./user'));
router.use('/cards', require('./card'));

module.exports = router;
