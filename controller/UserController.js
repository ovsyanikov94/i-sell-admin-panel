"use strict";

const User = require('../model/User');
const UserRole = require('../model/UserRole');
const UserStatus = require('../model/UserStatus');

const UserRoleEnum = require('../model/Enums/UserRole');
const UserStatusEnum = require('../model/Enums/UserStatus');


const Logger = require('../model/Logger');

const UtilsController = require('../controller/UtilsController');
const bcrypt = require('bcrypt');
const Response = require('../model/Response');
const constValidator = require('../model/Validation');
const validator = require('validator');
const fs = require('fs');
const fe = require('fs-extra');

module.exports.AddUser = async( req , res ) => {

    let validLogin =constValidator.USER_LOGIN_VALIDATOR.test( req.body.login)||'';
    let validEmail = constValidator.USER_EMAIL_VALIDATOR.test(req.body.email)||'';
    let validFirstName = constValidator.USER_FIRSTNAME_VALIDATOR.test(req.body.firstName)||'';
    let validLastName = constValidator.USER_LASTNAME_VALIDATOR.test(req.body.lastName)||'';
    let validPhone = constValidator.USER_PHONE_VALIDATOR.test(req.body.phone)||'';
    let validPassword = constValidator.USER_PASSWORD_VALIDATOR.test(req.body.password)||'';

    try{

        if(!validLogin||
            !validEmail||
            !validFirstName||
            !validLastName||
            !validPhone||
            !validPassword
        ){
            Response.status = 400;
            Response.message = 'не корректное значени!';
            res.status(Response.status);
            res.send(Response);
            return;
        }//if

        let checkUser = await User.findOne(
            {
                $or: [
                    {userLogin: req.body.login},
                    {userEmail: req.body.email}
                ]

            }, 'userLogin userEmail');

        console.log('checkUser: ' , checkUser);

        if(checkUser){

            Response.status = 400;
            Response.message = 'Данный логин или email уже используется!';
            res.status(Response.status);
            res.send(Response);
            return;

        }//if

        let number = Math.floor(Math.random() * (19 - 9+1) ) + 5; //генерируем случайное число символов от 9 до 19
        let saltStr = await bcrypt.genSalt(number);// создаем соль
        let hexPassword = await bcrypt.hash(req.body.password, saltStr); // получаем закодированный пароль

        let newUser = null;

        try {

            let status = await UserStatus.findOne(
                {
                    userStatusId: UserStatusEnum.NOT_VERIFIED
                },
                '_id'
            );

            let role = await UserRole.findOne(
                {
                    userRoleId: UserRoleEnum.REGISTERED
                },
                '_id'
            );

            newUser = new User({
                userLogin: req.body.login,
                userPassword: hexPassword,
                userEmail: req.body.email,
                userName: req.body.firstName,
                userLastname: req.body.lastName,
                userPhone: req.body.phone,
                role: role._id,
                userStatus: status._id,
            });

        } // Try
        catch(ex){

            console.log('Eeception: ' , ex);

            //let message = UtilsController.MakeMongooseMessageFromError(ex);

            res.status(400);
            res.send( {
                status: 400,
                message: ex
            } );

            return;


        } // Catch

        let createUserResult = await newUser.save();

        Response.status = 200;
        Response.message = `Регистрация успешна, проверьте email: ${createUserResult.userEmail}`;
        Response.data = null;

        res.status(Response.status);
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
        res.status(Response.status);
        res.send(Response);

    } // Catch

}; // AddUser

module.exports.updateUser = async(req,res)=>{

    let validIdUser = validator.isMongoId(req.body.userId)||'';

    if(!validIdUser){

        Response.status = 400;
        Response.message = 'не корректное значени!';
        res.status(Response.status);
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
            res.status(Response.status);
            res.send(Response);
            return;

        }//if

        let validEmail = constValidator.USER_EMAIL_VALIDATOR.test(req.body.email)||'';

        if(validEmail){

            existUser.set({
                email:req.body.email
            });

        }//if
        else{

            Response.status = 400;
            Response.message = 'не корректный email!';
            res.status(Response.status);
            res.send(Response);
            return;

        }//else

        let validFirstName = constValidator.USER_FIRSTNAME_VALIDATOR.test(req.body.firstName)||'';

        if(validFirstName){

            existUser.set({
                firstName:req.body.firstName
            });

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
            });

        }//if
        else{

            Response.status = 400;
            Response.message = 'не корректная фамилия !';
            res.status(Response.status);
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
            res.status(Response.status);
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
            res.status(Response.status);
            res.send(Response);
            return;

        }//else

        let validUserStatus = validator.isMongoId(req.body.userStatus)||'';

        if(validUserStatus){

            existUser.set({
                userStatus:req.body.userStatus
            });

        }//if
        else{

            Response.status = 400;
            Response.message = 'не корректный статус !';
            res.status(Response.status);
            res.send(Response);
            return;

        }//else

        let validPasswordOld = constValidator.USER_PASSWORD_VALIDATOR.test(req.body.oldPassword)||'';
        let validPasswordNew = constValidator.USER_PASSWORD_VALIDATOR.test(req.body.newPassword)||'';

        if(validPasswordOld && validPasswordNew) {

            let compare = await bcrypt.compare(req.body.oldPassword ,existUser.password );

            if(compare === true ){

                let number = Math.floor(Math.random() * (19 - 9+1) ) + 5 //генерируем случайное число символов от 9 до 19
                let saltStr = await bcrypt.genSalt(number);// создаем соль
                let newHexPassword = await bcrypt.hash(req.body.newPassword, saltStr); // получаем закодированный пароль

                existUser.set({
                    password:newHexPassword
                });

            }//if
            else {

                Response.status = 400;
                Response.message = 'не корректный пароль !';
                res.status(Response.status);
                res.send(Response);
                return;

            }//else

        }//if
        else{

            Response.status = 400;
            Response.message = 'не корректный пароль !';
            res.status(Response.status);
            res.send(Response);
            return;

        }//else

        let updateUser = await existUser.save();

        Response.status = 200;
        Response.message = 'обновления прошли успешно!';
        Response.data = null;

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

    }//catch

    res.status(Response.status);
    res.send(Response);

};//updateUser

module.exports.addUserAvatar = async (req,res)=>{

    let validIdUser = validator.isMongoId(req.body.userId)||'';

    if(!validIdUser){

        Response.status = 400;
        Response.message = 'не корректное значени!';
        res.status(Response.status);
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
            res.status(Response.status);
            res.send(Response);
            return;

        }//if

        if(req.files){

            let userAvatar = req.files.image;
            let path = `public/images/avatar/${existUser._id}`;


            if(!fs.existsSync('public/images')){
                fs.mkdirSync('public/images');
            }

            if(!fs.existsSync('public/images/avatar')){
                fs.mkdirSync('public/images/avatar');
            }

            try{

                if(!fs.existsSync(`public/images/avatar/${path}`)){
                    fs.mkdirSync(`public/images/avatar/${path}`);
                }
                if(!fs.existsSync(existUser.image)) {
                    userAvatar.mv(`${path}/${userAvatar.name}`, async function (error) {
                        if (error){
                            let message = UtilsController.MakeMongooseMessageFromError(error);
                            Response.status = 500;
                            Response.message = message;
                            res.status(Response.status)
                            res.send(Response);
                            return;
                        }//if

                        existUser.set({
                            image:`${path}/${userAvatar.name}`
                        });
                        await existUser.save();

                    });

                }//if
                else{
                    fe.remove(existUser.image, async function (err) {
                        if (!err) {

                            userAvatar.mv(`${path}/${userAvatar.name}`, async function (error) {
                                if (error){
                                    let message = UtilsController.MakeMongooseMessageFromError(error);
                                    Response.status = 500;
                                    Response.message = message;
                                    res.status(Response.status)
                                    res.send(Response);
                                    return;
                                }//if

                                existUser.image = `${path}/${userAvatar.name}`
                                await existUser.save();

                            });
                        }

                    });
                }//else

                Response.status = 200;
                Response.message = 'добавление прошли успешно!';
                Response.data = `${path}/${userAvatar.name}`;
            }catch(ex){
                let message = UtilsController.MakeMongooseMessageFromError(ex);

                Response.status = 500;
                Response.message = message;
                res.status(Response.status)
                res.send(Response);
                return;
            }



        }//if
        else {
            Response.status = 400;
            Response.message = 'не корректное значени!';
            res.status(Response.status);
            res.send(Response);
            return;

        }//else
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

    }//catch

    res.status(Response.status);
    res.send(Response);
}//addUserAvatar

module.exports.removeUserAvatar = async (req,res)=>{
    let validIdUser = validator.isMongoId(req.body.userId)||'';

    if(!validIdUser){

        Response.status = 400;
        Response.message = 'не корректное значени!';
        res.status(Response.status);
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
            res.status(Response.status);
            res.send(Response);
            return;

        }//if
        if(!fs.existsSync(existUser.image)){
            fe.remove(existUser.image, async function (err) {
                if (!err) {

                    existUser.image = null;
                   await existUser.save();
                }//if

            });
        }//if
        Response.status = 200;
        Response.message = 'обновления прошли успешно!';
        Response.data = null;
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
    }//catch

    res.status(Response.status);
    res.send(Response);
}

module.exports.AddUserWithRole = async( req , res ) => {

    let validLogin =constValidator.USER_LOGIN_VALIDATOR.test( req.body.login)||'';
    let validEmail = constValidator.USER_EMAIL_VALIDATOR.test(req.body.email)||'';
    let validFirstName = constValidator.USER_FIRSTNAME_VALIDATOR.test(req.body.firstName)||'';
    let validLastName = constValidator.USER_LASTNAME_VALIDATOR.test(req.body.lastName)||'';
    let validPhone = constValidator.USER_PHONE_VALIDATOR.test(req.body.phone)||'';
    let validPassword = constValidator.USER_PASSWORD_VALIDATOR.test(req.body.password)||'';
    let userRole = req.body.role ||'';
    let photo = req.body.photo ||'';
    try{

        if(!validLogin){
            Response.status = 400;
            Response.message = 'Логин не корректный!';
            res.status(Response.status);
            res.send(Response);
            return;
        }
        if(!validEmail){
            Response.status = 400;
            Response.message = 'Email не корректный!';
            res.status(Response.status);
            res.send(Response);
            return;
        }
        if(!validFirstName){
            Response.status = 400;
            Response.message = 'Имя не корректно!';
            res.status(Response.status);
            res.send(Response);
            return;
        }
        if(!validLastName){
            Response.status = 400;
            Response.message = 'Фамилия не корректна!';
            res.status(Response.status);
            res.send(Response);
            return;
        }
        if( !validPhone){
            Response.status = 400;
            Response.message = 'Телефон не корректен!';
            res.status(Response.status);
            res.send(Response);
            return;
        }
        if( !validPassword){
            Response.status = 400;
            Response.message = 'Пароль не корректен!';
            res.status(Response.status);
            res.send(Response);
            return;
        }
        if(!userRole){
            Response.status = 400;
            Response.message = 'Вы не выбрали роль пользователя!';
            res.status(Response.status);
            res.send(Response);
            return;
        }
        if(!photo){
            Response.status = 400;
            Response.message = 'Выберите фото пользователя!';
            res.status(Response.status);
            res.send(Response);
            return;
        }
        let checkUser = await User.findOne(
            {
                $or: [
                    {userLogin: req.body.login},
                    {userEmail: req.body.email}
                ]

            }, 'userLogin userEmail');

        console.log('checkUser: ' , checkUser);

        if(checkUser){

            Response.status = 400;
            Response.message = 'Данный логин или email уже используется!';
            res.status(Response.status);
            res.send(Response);
            return;

        }//if

        let number = Math.floor(Math.random() * (19 - 9+1) ) + 5; //генерируем случайное число символов от 9 до 19
        let saltStr = await bcrypt.genSalt(number);// создаем соль
        let hexPassword = await bcrypt.hash(req.body.password, saltStr); // получаем закодированный пароль

        let newUser = null;

        try {

            let status = await UserStatus.findOne(
                {
                    userStatusId: UserStatusEnum.NOT_VERIFIED
                },
                '_id'
            );
            let role = null;

            switch(userRole) {
                case '1':
                     role = await UserRole.findOne(
                        {
                            userRoleId: UserRoleEnum.ADMIN
                        },
                        '_id'
                    );

                    break;
                case '2':
                    role = await UserRole.findOne(
                        {
                            userRoleId: UserRoleEnum.MODERATOR
                        },
                        '_id'
                    );

                    break;

                case '3':
                    role = await UserRole.findOne(
                        {
                            userRoleId: UserRoleEnum.REGISTERED
                        },
                        '_id'
                    );

                    break;
                case '4':
                    role = await UserRole.findOne(
                        {
                            userRoleId: UserRoleEnum.ANONYMOUS
                        },
                        '_id'
                    );

                    break;

            };

            try {

                newUser = new User({
                    userLogin: req.body.login,
                    userPassword: hexPassword,
                    userEmail: req.body.email,
                    userName: req.body.firstName,
                    userLastname: req.body.lastName,
                    userPhone: req.body.phone,
                    role: role._id,
                    userStatus: status._id,
                });


            }//try
            catch(ex){

                let message = UtilsController.MakeMongooseMessageFromError(ex);

                Response.status = 400;
                Response.message = message;

                res.status(Response.status);
                res.send(Response);

                return ;

            }//catch


            if(req.files){

                let userImages = req.files.images;
                let path = `public/images/users/${newUser._id}`;


                if(!fs.existsSync('public/images')){
                    fs.mkdirSync('public/images');
                }//if

                if(!fs.existsSync('public/images/users')){
                    fs.mkdirSync('public/images/users');
                }//if

                try{
                    fs.mkdirSync(path);
                }//catch
                catch(ex){
                    console.log(ex)
                }//try

                for (let i=0; i<userImages.length; i++){

                    let userImage = userImages[i];

                    userImage.mv( `${path}/${userImage.name}`,async function(err){

                        if (err){
                            console.log('FILE UPLOAD ERROR:' , err);
                            return;
                        }//if

                        let pathLot = `images/users/${newUser._id}/${userImage.name}`;
                        newUser.userPhoto = pathLot;

                    })//lotImage.mv
                } //for

            }//if req.files



        } // Try
        catch(ex){

            console.log('Eeception: ' , ex);

            //let message = UtilsController.MakeMongooseMessageFromError(ex);

            res.status(400);
            res.send( {
                status: 400,
                message: ex
            } );

            return;


        } // Catch

        let createUserResult = await newUser.save();

        Response.status = 200;
        Response.message = `Добавление юзера успешно, проверьте email: ${createUserResult.userEmail}`;
        Response.data = null;

        res.status(Response.status);
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
        res.status(Response.status);
        res.send(Response);

    } // Catch

}; // AddUser