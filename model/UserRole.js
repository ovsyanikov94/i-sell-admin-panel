"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constValidator = require('./Validation');
const userRoleSchema = new Schema({

    roleTitle: {
        type: String,
        validate:{
            validator: ( role )=>{
                return  constValidator.TITLE_VALIDATOR.test(role)
            }, // Validator Login
            message: props => `Ошибка. Введите корректную роль! \n"${props.value}"`
        },
    },
    userRoleId:Number,
    user:{
        type: Schema.Types.ObjectId,
        ref:'users'
    }

});

module.exports = mongoose.model('roles' , userRoleSchema);