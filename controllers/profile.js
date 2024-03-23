const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/user');


exports.profile = async (req, res, next) => {

    try {
        const user = await User.findById(req.userId).select('-password');
        if(!user) {

            const error = new Error('Nothing found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({message : 'profile loaded', user : user});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}

exports.updateProfile = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            const error = new Error('invalid data from your data, please check your value');
            error.statusCode = 422;
            throw error;
        }

        const { firstName, lastName, username, email, password, ConfirmPass, gender, profilePic, bio, city, company, workEmail } = req.body;

        const user = await User.findById(req.userId);
        if(!user) {

            const error = new Error('Nothing found');
            error.statusCode = 404;
            throw error;
        }

        const isPassword = await bcrypt.compare(ConfirmPass, user.password);
        if(!isPassword) {

            const error = new Error('Wrong password, please check your password');
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const updatedProfile = await User.updateOne({
            $set : {

                firstName,
                lastName,
                username,
                email,
                password : hashedPass,
                gender,
                profilePic : gender === 'male' ? boyProfilePic : girlProfilePic,
                bio,
                city,
                company,
                workEmail
            }
        });

        res.status(201).json({message : 'profile has been updated', userId : user._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}