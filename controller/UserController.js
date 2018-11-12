"use strict";

const User = require('../model/User');
const Logger = require('../model/Logger');

const UtilsController = require('../controller/UtilsController');
const bcrypt = require('bcrypt');
const Response = require('../model/Response');
const constValidator = require('../model/Validation');
const validator = require('validator');

module.exports.AddUser = async( req , res ) => {

    let validLogin =constValidator.USER_LOGIN_VALIDATOR.test( req.body.login)||'';
    let validEmail = constValidator.USER_EMAIL_VALIDATOR.test(req.body.email)||'';
    let validFirstName = constValidator.USER_FIRSTNAME_VALIDATOR.test(req.body.firstName)||'';
    let validLastName = constValidator.USER_LASTNAME_VALIDATOR.test(req.body.lastName)||'';
    let validPhone = constValidator.USER_PHONE_VALIDATOR.test(req.body.phone)||'';
    let validPassword = constValidator.USER_PASSWORD_VALIDATOR.test(req.body.password)||'';
    let validRole =validator.isMongoId(req.body.role)||'';
    let validUserStatus = validator.isMongoId(req.body.userStatus)||'';
    //let rating = +req.body.rating;
    // let lots = req.body.lots;
    //let image = req.body.image;
    if(!validLogin||
        !validEmail||
        !validFirstName||
        !validLastName||
        !validPhone||
        !validPassword||
        !validRole||
        !validUserStatus
    ){
        Response.status = 400;
        Response.message = 'не корректное значени!';
        res.status(Response.status)
        res.send(Response);
        return;
    }//if

    try{

        let number = Math.floor(Math.random() * (19 - 9+1) ) + 5 //генерируем случайное число символов от 9 до 19
        let saltStr = bcrypt.genSaltSync(number);// создаем соль
        let hexPassword = bcrypt.hashSync(req.body.password, saltStr); // получаем закодированный пароль

        let newUser = null;

        try {

            newUser = new User({
                login: req.body.login,
                saltStr:saltStr,
                password: hexPassword,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                role:req.body.role,
                userStatus:req.body.userStatus,

            });

        } // Try
        catch(ex){

            let message = UtilsController.MakeMongooseMessageFromError(ex);

            res.status(400);
            res.send( {
                code: 400,
                message: message
            } );

            return;

        } // Catch

       /* role.forEach( r => {
            newUser.role.push( r );
        } );

        userStatus.forEach( us => {
            newUser.userStatus.push( us );
        } );

        lots.forEach( l => {
            newUser.lots.push( l );
        } );*/

        let createUserResult = await newUser.save();

        Response.status = 200;
        Response.message = 'пользователь успешно долбавлен!';
        Response.data = createUserResult;
        res.status(Response.status)
        res.send(Response);

    } // Try
    catch(ex){

        Logger.error({
            time: new Date().toISOString(),
            status: 500,
            data: {
                message: ex.message,
                stack: ex.stack
            },
        });

        Response.status = 500;
        Response.message = 'Внутренняя ошибка сервера!';
        Response.data = null;
        res.status(Response.status)
        res.send(Response);

    } // Catch

}; // AddUser

module.exports.updateUser = async(req,res)=>{
    let validIdUser = validator.isMongoId(req.body.userId)||''

    if(!validIdUser){
        Response.status = 400;
        Response.message = 'не корректное значени!';
        res.status(Response.status)
        res.send(Response);
        return;
    }//if
    try {

        let existUser = await User.find({
            id:req.body.userId
        });

        if(!existUser){
            Response.status = 400;
            Response.message = 'не корректное значени!';
            res.status(Response.status)
            res.send(Response);
            returnж
        }//if

        let validEmail = constValidator.USER_EMAIL_VALIDATOR.test(req.body.email)||'';
        if(validEmail){
            existUser.set({
                email:req.body.email
            })
        }
        else{
            Response.status = 400;
            Response.message = 'не корректный email!';
            res.status(Response.status)
            res.send(Response);
            return;
        }
        let validFirstName = constValidator.USER_FIRSTNAME_VALIDATOR.test(req.body.firstName)||'';
        if(validFirstName){
            existUser.set({
                firstName:req.body.firstName
            })
        }//if
        else{
            Response.status = 400;
            Response.message = 'не корректное имя !';
            res.status(Response.status)
            res.send(Response);
            return;
        }//else
        let validLastName = constValidator.USER_LASTNAME_VALIDATOR.test(req.body.lastName)||'';
        if(validLastName){
            existUser.set({
                lastName:req.body.lastName
            })
        }//if
        else{
            Response.status = 400;
            Response.message = 'не корректная фамилия !';
            res.status(Response.status)
            res.send(Response);
            return;
        }//else
        let validPhone = constValidator.USER_PHONE_VALIDATOR.test(req.body.phone)||'';
        if(validPhone){
            existUser.set({
                phone:req.body.phone
            })
        }//if
        else{
            Response.status = 400;
            Response.message = 'не корректный телефон !';
            res.status(Response.status)
            res.send(Response);
            return;
        }//else

        let validRole =validator.isMongoId(req.body.role)||'';
        if(validRole){
            existUser.set({
                role:req.body.role
            })
        }//if
        else{
            Response.status = 400;
            Response.message = 'не корректная роль !';
            res.status(Response.status)
            res.send(Response);
            return;
        }//else
        let validUserStatus = validator.isMongoId(req.body.userStatus)||'';
        if(validRole){
            existUser.set({
                userStatus:req.body.userStatus
            })
        }//if
        else{
            Response.status = 400;
            Response.message = 'не корректный статус !';
            res.status(Response.status)
            res.send(Response);
            return;
        }//else

        let validPasswordOld = constValidator.USER_PASSWORD_VALIDATOR.test(req.body.oldPassword)||'';
        let validPasswordNew = constValidator.USER_PASSWORD_VALIDATOR.test(req.body.newPassword)||'';
        if(validPasswordOld&&validPasswordNew) {

            let oldHexPassword = bcrypt.hashSync(validPasswordOld,existUser.saltStr); // получаем закодированный пароль

            if(existUser.password===oldHexPassword){

                let number = Math.floor(Math.random() * (19 - 9+1) ) + 5 //генерируем случайное число символов от 9 до 19
                let saltStr = bcrypt.genSaltSync(number);// создаем соль
                let newHexPassword = bcrypt.hashSync(req.body.newPassword, saltStr); // получаем закодированный пароль

                existUser.set({
                    saltStr:saltStr,
                    password:newHexPassword
                });
            }//if
            else {
                Response.status = 400;
                Response.message = 'не корректный пароль !';
                res.status(Response.status)
                res.send(Response);
                return;
            }//else
        }//if
        else{
            Response.status = 400;
            Response.message = 'не корректный пароль !';
            res.status(Response.status)
            res.send(Response);
            return;
        }//else

        let updateUser = await existUser.save();

        Response.status = 200;
        Response.message = 'обновления прошли успешно!';
        Response.data = updateUser;
        res.status(Response.status)
        res.send(Response);
    }//try
    catch (ex){

        Logger.error({
            time: new Date().toISOString(),
            status: 500,
            data: {
                message: ex.message,
                stack: ex.stack
            },
        });

        Response.status = 500;
        Response.message = 'Внутренняя ошибка сервера!';
        Response.data = null;
        res.status(Response.status)
        res.send(Response);

    }//catch
}//updateUser