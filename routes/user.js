const router = require('express').Router();
const {
  getAllUsers,
  getUser,
  newUser,
  setUserProfile,
} = require('../controllers/user');

router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.post('/', newUser);
router.patch('/me', setUserProfile);
router.patch('/me/avatar', setUserProfile);

module.exports = router;
