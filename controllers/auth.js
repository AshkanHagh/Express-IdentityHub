const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


exports.signup = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            const error = new Error('invalid data from your data, please check your value');
            error.statusCode = 422;
            throw error;
        }

        const { firstName, lastName, username, email, password, gender } = req.body;

        const isUsernameExists = await User.findOne({username});
        if(isUsernameExists && 'undefined') {

            const error = new Error('Username already exists');
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const user = new User({

            firstName,
            lastName,
            username,
            email,
            password : hashedPass,
            gender,
            profilePic : gender === 'male' ? boyProfilePic : girlProfilePic
        });

        await user.save();

        res.status(201).json({message : 'Account has been created', userId : user._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}

exports.login = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            const error = new Error('invalid data from your data, please check your value');
            error.statusCode = 422;
            throw error;
        }

        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) {

            const error = new Error('Wrong email, please check your email');
            error.statusCode = 409;
            throw error;
        }

        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword) {

            const error = new Error('Wrong password, please check your password');
            error.statusCode = 409;
            throw error;
        }

        const token = jwt.sign({email : user.email, userId : user._id}, process.env.JWT_SECRET, {expiresIn : '1d'});

        res.status(201).json({message : 'welcome', userId : user._id, token : token});
        
    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}