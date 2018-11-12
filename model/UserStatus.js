"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constValidator = require('./Validation');
const userStatusSchema = new Schema({

    statusTitle: {
        type: String,
        validate:{
            validator: ( role )=>{
                return  constValidator.STATUS_TITLE_VALIDATOR.test(role)
            }, // Validator Login
            message: props => `Ошибка. Введите корректный статус! \n"${props.value}"`
        },
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'users'
    }

});

module.exports = mongoose.model('userStatus' , userStatusSchema);