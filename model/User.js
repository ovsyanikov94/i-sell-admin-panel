"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constValidator = require('./Validation');
/*
const roles = require('./Role');
const userStatus = require('./UserStatus');
const lots = require('./Lot');
*/


const userSchema = new Schema({

    login: {
        type: String,
        validate:{
            validator: ( login )=>{
                return  constValidator.USER_LOGIN_VALIDATOR.test(login)
            }, // Validator Login
            message: props => `Введите корректный логин с 4 до 16 букв и цифр \n"${props.value}"`
        },
    },
    saltStr:{
        type: String,
        validate:{
            validator: ( password )=>{
                return constValidator.USER_PASSWORD_VALIDATOR.test(password)
            }, // Validator Password
            message: props => `Пароль должен содержать хотя-бы одну заглавную букву, и иметь не менее 6 символов \n"${props.value}"`
        },
    },
    password: {
        type: String,
        validate:{
            validator: ( password )=>{
                return constValidator.USER_HASH_PASSWORD_VALIDATOR.test(password)
            }, // Validator Password
            message: props => `Пароль должен содержать хотя-бы одну заглавную букву, и иметь не менее 6 символов \n"${props.value}"`
        },
    },

    email: {
        type: String,
        validate:{
            validator: ( email )=>{
                return constValidator.USER_EMAIL_VALIDATOR.test(email)
            }, // Validator Email
            message: props => `Введен некоректный E-Mail, пример: test@example.com \n "${props.value}"`
        },
    },

    firstName: {
        type: String,
        validate:{
            validator: ( fName )=>{
                return constValidator.USER_FIRSTNAME_VALIDATOR.test(fName)
            }, // Validator FirstName
            message: props => `Ошибка. Имя не должно содержать цифр, пробелов, символов и не превышать 12 строк \n "${props.value}"`
        },
    },

    lastName: {
        type: String,
        validate:{
            validator: ( lName )=>{
                return constValidator.USER_LASTNAME_VALIDATOR.test(lName)
            }, // Validator FirstName
            message: props => `Ошибка. Фамилия не должна содержать цифр, пробелов, символов и не превышать 12 строк \n "${props.value}"`
        },
    },

    image: {
        type: String, // Либо Image, хз
        validate:{
            validator: ( image )=>{
                return image.maxSize = "6m" // Тут спорно, без теста не могу сделать :(
            }, // Validator Image
            message: props => `Ошибка. Размер фотографии не должен превышать 6 мб \n"${props.value}"`
        },
    },

    rating: {
        type: Number,
        validate:{
            validator: ( rating )=>{
                return rating <= 500
            }, // Validator Rating
            message: props => `Ошибка. Рейтинг не должен превышать 500! "${props.value}"`
        },
    },

    role: [
        {
            type: Schema.Types.ObjectId,
            ref: 'roles'
        }
    ],

    phone: {
        type: String, // Не Number, потому что имеет символы
        validate:{
            validator: ( phone )=>{
                return constValidator.USER_PHONE_VALIDATOR.test(phone);
            }, // Validator Phone - Можно ли тут использовать массив, хз. 1 - номер Рус, 2 - номер Укр.
            message: props => `Ошибка. Неккоректный номер! "${props.value}"`
        },
    },

    userStatus:
        {
            type: Schema.Types.ObjectId,
            ref: 'userStatus'
        }
    ,

    blackList:{
        type: Schema.Types.ObjectId,
        ref: 'blackList'
    },
    blockList:{
        type: Schema.Types.ObjectId,
        ref: 'blockList'
    },
    subscribersList:{
        type: Schema.Types.ObjectId,
        ref: 'subscribers'
    },
    lots: [
        {
            type: Schema.Types.ObjectId,
            ref: 'lots'
        }
    ]

});

module.exports = mongoose.model('users' , userSchema);