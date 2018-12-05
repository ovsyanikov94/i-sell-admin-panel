"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constValidator = require('./Validation');
const bcrypt = require('bcrypt');

const userSchema = new Schema({

    userLogin: {
        type: String,
        validate:{
            validator: ( login )=>{
                return  constValidator.USER_LOGIN_VALIDATOR.test(login)
            }, // Validator Login
            message: props => `Введите корректный логин с 4 до 16 букв и цифр \n"${props.value}"`
        },
    },
    userPassword: {
        type: String,
        validate:{
            validator: ( password )=>{
                return password.length > 0;
            }, // Validator Password
            message: props => `Пароль должен содержать хотя-бы одну заглавную букву, и иметь не менее 6 символов \n"${props.value}"`
        },
    },
    userEmail: {
        type: String,
        validate:{
            validator: ( email )=>{
                return constValidator.USER_EMAIL_VALIDATOR.test(email)
            }, // Validator Email
            message: props => `Введен некоректный E-Mail, пример: test@example.com \n "${props.value}"`
        },
    },
    userName: {
        type: String,
        validate:{
            validator: ( fName )=>{
                return constValidator.USER_FIRSTNAME_VALIDATOR.test(fName)
            }, // Validator FirstName
            message: props => `Ошибка. Имя не должно содержать цифр, пробелов, символов и не превышать 12 строк \n "${props.value}"`
        },
    },
    userLastname: {
        type: String,
        validate:{
            validator: ( lName )=>{
                return constValidator.USER_LASTNAME_VALIDATOR.test(lName)
            }, // Validator FirstName
            message: props => `Ошибка. Фамилия не должна содержать цифр, пробелов, символов и не превышать 12 строк \n "${props.value}"`
        },
    },
    userPhoto: {
        type: String, // Либо Image, хз
        //validate:{
            //validator: ( image )=>{
                //return image.maxSize = "1000m" // Тут спорно, без теста не могу сделать :(
           // }, // Validator Image
            //message: props => `Ошибка. Размер фотографии не должен превышать 6 мб \n"${props.value}"`
       // },
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
    role: {
        type: Schema.Types.ObjectId,
        ref: 'roles'
    },
    userPhone: {
        type: String, // Не Number, потому что имеет символы
        validate:{
            validator: ( phone )=>{
                return constValidator.USER_PHONE_VALIDATOR.test(phone);
            }, // Validator Phone - Можно ли тут использовать массив, хз. 1 - номер Рус, 2 - номер Укр.
            message: props => `Ошибка. Неккоректный номер! "${props.value}"`
        },
    },
    userStatus: {
        type: Schema.Types.ObjectId,
        ref: 'userStatus'
    },
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
    ],
    userCountSum:{
        type: Number,
        validate:{
            validator: ( userCountSum )=>{
                return userCountSum >= constValidator.USER_COUNT_MONEY;
            },//validator
            message: props => `Количество денег задано неверно: "${props.value}"`
        },
    }



});

// const adminSchema = new Schema({
//
//     base: {
//         type: Schema.Types.ObjectId,
//         ref: 'users'
//     },
//
// });

userSchema.methods.verifyPassword = async function ( password ) {

    try{

        let hashPassword = this.userPassword;

        return await bcrypt.compare( password ,hashPassword );

    }//try
    catch(ex){

        return false;

    }//catch

};

let id = userSchema.virtual('id');

id.get(function (  ) {
    return this._id;
});

module.exports = mongoose.model('users' , userSchema);