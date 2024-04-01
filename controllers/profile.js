const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const User = require('../models/user');


exports.getProfile = async (req, res, next) => {

    try {
        const user = await User.findById(req.userId).select('-password');
        if(!user) {

            const error = new Error('Sorry. requested user could not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({message : 'User profile is ready', user});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}


exports.editPassword = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            const error = new Error('invalid data from your data, please check your value');
            error.statusCode = 422;
            throw error;
        }

        const user = await User.findById(req.userId);
        if(!user) {

            const error = new Error('Sorry. requested user could not found');
            error.statusCode = 404;
            throw error;
        }

        if(user._id.toString() != req.userId) {

            const error = new Error('not authorized');
            error.statusCode = 401;
            throw error;
        }

        const { confirmPass , password } = req.body;

        const isPassword = await bcrypt.compare(confirmPass, user.password);
        if(!isPassword) {

            const error = new Error('Wrong password, please check your password');
            error.statusCode = 401;
            throw error;
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(password, salt);

        await user.updateOne({
            $set : {
                password : hashedPass
            }
        });

        await user.save();

        res.status(201).json({message : 'password has been change', userId : user._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}


exports.editProfile = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {

            const error = new Error('invalid data from your data, please check your value');
            error.statusCode = 422;
            throw error;
        }

        const { username, email } = req.body;
        const body = req.body;

        const user = await User.findById(req.userId);
        if(!user) {

            const error = new Error('Sorry. requested user could not found');
            error.statusCode = 404;
            throw error;
        }

        if(user._id.toString() != req.userId) {

            const error = new Error('not authorized');
            error.statusCode = 401;
            throw error;
        }

        const isExists = await User.findOne({username, email});;
        if(isExists) {

            const error = new Error('Username || Email already exists');
            error.statusCode = 409;
            throw error;
        }

        if(body.password) {

            const error = new Error('could not change your password here');
            error.statusCode = 401;
            throw error;
        }

        await user.updateOne({
            $set : body
        });

        await user.save();

        res.status(201).json({message : 'Profile has been updated', userId : user._id});

    } catch (error) {
        
        if(!error.statusCode) {

            error.statusCode = 500;
        }
        next(error);
    }

}