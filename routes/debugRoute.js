const router = require('express').Router();
const { signup } = require('../controllers/debugController');

router.route('/signup').post(signup);

module.exports = router;