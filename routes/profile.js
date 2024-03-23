const { body } = require('express-validator');
const router = require('express').Router();
const isAuth = require('../middlewares/verify-token');

const profileController = require('../controllers/profile');


router.get('/profile', isAuth, profileController.profile);

router.put('/profile', [body('firstName').trim().notEmpty(), body('lastName').trim().notEmpty(), body('username').trim().notEmpty(), 
body('password').trim().notEmpty(), body('email').trim().isEmail().notEmpty(), body('workEmail').trim().isEmail().notEmpty()]
, isAuth, profileController.updateProfile);


module.exports = router;