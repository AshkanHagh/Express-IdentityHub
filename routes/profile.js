const { body } = require('express-validator');
const router = require('express').Router();

const isAuth = require('../middlewares/verify-token');

const profileController = require('../controllers/profile');


router.get('/', isAuth, profileController.getProfile);

router.put('/password', body('password').trim().isLength({min : 6}).notEmpty(), isAuth, profileController.editPassword);

router.put('/setting', isAuth, profileController.editProfile);


module.exports = router;