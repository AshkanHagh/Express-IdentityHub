const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        length : {
            minimize : 6
        }
    },
    gender : {
        type : String,
        required : true,
        enum : ['male', 'female'],
    },
    profilePic : {
        type : String,
        required : false,
        default : ''
    },
    bio : {
        type : String,
        required : false,
        length : {max : 255}
    },
    city : {
        type : String,
        required : false,
    }
}, {timestamps : true});


module.exports = mongoose.model('User', userSchema);