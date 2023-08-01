const router = require('express').Router();

router.use('/users', require('./user'));
router.use('/cards', require('./card'));

module.exports = router;
