const router = require('express').Router();

const {
  getAllUsers,
  getUser,
  setUserProfile,
  setUserAvatar,
} = require('../controllers/user');

router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.patch('/me', setUserProfile);
router.patch('/me/avatar', setUserAvatar);

module.exports = router;
