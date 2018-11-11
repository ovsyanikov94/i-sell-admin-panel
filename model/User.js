"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roles = require('./Role');
const userStatus = require('./UserStatus');
const lots = require('./Lot');


const userSchema = new Schema({

    login: {
        type: String,
        validate:{
            validator: ( login )=>{
                return  /^[a-z\d]{4,16}$/i.test(login)
            }, // Validator Login
            message: props => `Введите корректный логин с 4 до 16 букв и цифр \n"${props.value}"`
        },
    },

    password: {
        type: String,
        validate:{
            validator: ( password )=>{
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,25}$/i.test(password)
            }, // Validator Password
            message: props => `Пароль должен содержать хотя-бы одну заглавную букву, и иметь не менее 6 символов \n"${props.value}"`
        },
    },

    email: {
        type: String,
        validate:{
            validator: ( email )=>{
                return /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i.test(email)
            }, // Validator Email
            message: props => `Введен некоректный E-Mail, пример: test@example.com \n "${props.value}"`
        },
    },

    firstName: {
        type: String,
        validate:{
            validator: ( fName )=>{
                return /^[a-zа-я]{1,12}$/i.test(fName)
            }, // Validator FirstName
            message: props => `Ошибка. Имя не должно содержать цифр, пробелов, символов и не превышать 12 строк \n "${props.value}"`
        },
    },

    lastName: {
        type: String,
        validate:{
            validator: ( lName )=>{
                return /^[a-zа-я]{1,20}$/i.test(lName)
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
                return [/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/i, /^\+\d{2}\(\d{3}\)\d{3}-\d{2}-\d{2}$/i].test(phone);
            }, // Validator Phone - Можно ли тут использовать массив, хз. 1 - номер Рус, 2 - номер Укр.
            message: props => `Ошибка. Неккоректный номер! "${props.value}"`
        },
    },

    userStatus: [
        {
            type: Schema.Types.ObjectId,
            ref: 'userStatus'
        }
    ],

    lots: [
        {
            type: Schema.Types.ObjectId,
            ref: 'lots'
        }
    ]

});

module.exports = mongoose.model('users' , userSchema);