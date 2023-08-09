const router = require('express').Router();
const {
  getAllUsers,
  getUser,
  newUser,
  setUserProfile,
  setUserAvatar,
  login,
} = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/signup', newUser);
router.post('/signin', login);

router.use(auth);
router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.patch('/me', setUserProfile);
router.patch('/me/avatar', setUserAvatar);

module.exports = router;
