const router = require('express').Router();
const {
  getAllUsers,
  getUser,
  newUser,
  setUserProfile,
  setUserAvatar,
  login,
} = require('../controllers/user');

router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.post('/signup', newUser);
router.post('/signin', login);
router.patch('/me', setUserProfile);
router.patch('/me/avatar', setUserAvatar);

module.exports = router;
