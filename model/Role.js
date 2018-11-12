"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({

    roleTitle: {
        type: String,
        validate:{
            validator: ( role )=>{
                return  /^[a-zа-я\s]{1,10}$/i.test(role)
            }, // Validator Login
            message: props => `Введите корректную роль! \n"${props.value}"`
        },
    }

});

module.exports = mongoose.model('roles' , roleSchema);