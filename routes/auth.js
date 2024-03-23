const { body } = require('express-validator');
const router = require('express').Router();

const authController = require('../controllers/auth');


router.post('/signup', [body('firstName').trim().notEmpty(), body('lastName').trim().notEmpty(), body('username').trim().notEmpty().isLowercase(), 
body('email').trim().isEmail().notEmpty(), body('password').trim().notEmpty()], authController.signup);

router.post('/login', [body('email').trim().isEmail().notEmpty(), body('password').trim().notEmpty()], authController.login);


module.exports = router;