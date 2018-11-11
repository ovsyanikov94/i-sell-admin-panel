"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userStatusSchema = new Schema({

    statusTitle: {
        type: String,
        validate:{
            validator: ( role )=>{
                return  /^[a-zа-я\s]{1,10}$/i.test(role)
            }, // Validator Login
            message: props => `Ошибка. Введите корректный статус! \n"${props.value}"`
        },
    }

});

module.exports = mongoose.model('userStatus' , userStatusSchema);