const router = require('express').Router();
const { getUsers, getUser, newUser } = require('../controllers/user');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', newUser);

module.exports = router;
