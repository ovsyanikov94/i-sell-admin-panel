"use strict";

const User = require('../../model/User');
const Admin = require('../../model/Admin');
const UserRole = require('../../model/UserRole');
const UserStatus = require('../../model/UserStatus');

const UserRoleEnum = require('../../model/Enums/UserRole');
const UserStatusEnum = require('../../model/Enums/UserStatus');
const lotImagePath = require('../../model/LotImage');
const Logger = require('../../model/Logger');

const UtilsController = require('../UtilsController');
const bcrypt = require('bcrypt');
const Response = require('../../model/Response');
const constValidator = require('../../model/Validation');
const validator = require('validator');
const fs = require('fs');

module.exports.updateAdmin = async(req,res)=>{

    let id = req.session.passport.user._id;
    let email = req.body.email||'';
    let firstName = req.body.firstName||'';
    let lastName =req.body.lastName||'';
    let phone = req.body.phone||'';


    let errors = [];

    let role = req.body.role;
    let status = req.body.userStatus;


    try {


        let existUser = await User.findOne({_id:id},'userName userLastname userPhoto userLogin role userPhone userEmail');


        if(!existUser){

            Response.status = 400;
            Response.message = 'не корректное значени!';
            res.status(Response.status);
            res.send(Response);
            return;

        }//if

        let validEmail = constValidator.USER_EMAIL_VALIDATOR.test(email)||'';

        if( !validEmail && req.body.email){
            errors.push( 'Email не корректен!' );
        }//if

        if(validEmail && existUser.userEmail !== email){
            existUser.userEmail = email;

        }//if


        let validFirstName = constValidator.USER_FIRSTNAME_VALIDATOR.test(firstName) || '';

        if(validFirstName && existUser.userName!==firstName){

            existUser.userName = firstName;


        }//if

        let validLastName = constValidator.USER_LASTNAME_VALIDATOR.test(lastName)||'';

        if(validLastName && existUser.userLastname !==lastName){

            existUser.userLastname = lastName;
        }//if


        let validPhone = constValidator.USER_PHONE_VALIDATOR.test(phone)||'';

        if(validPhone && existUser.userPhone !== phone){

            existUser.userPhone = phone;

        }//if



        if(role!==undefined){
            let validRole = validator.isMongoId(role)||'';
            if(validRole && existUser.role !== role){

                existUser.role = role;

            }//if
        }//if

        if(status!==undefined){
            let validUserStatus = validator.isMongoId(status)||'';

            if(validUserStatus && existUser.userStatus!== status ){

                existUser.userStatus = status;

            }//if
        }



        if(req.files){

            let userImage = req.files.valueOf();
            let path = `public/images/users/${existUser._id}`;


            if(!fs.existsSync('public/images')){
                fs.mkdirSync('public/images');
            }//if

            if(!fs.existsSync('public/images/users')){
                fs.mkdirSync('public/images/users');
            }//if

            try{
                if(!fs.existsSync(path)) {
                    fs.mkdirSync(path);

                }
            }//catch
            catch(ex){
                console.log(ex)
            }//try



            userImage.photo.mv(`${path}/${userImage.photo.name}`, async function(err) {

                if (err) {
                    console.log('FILE UPLOAD ERROR:', err);
                    return;
                }//if

                let addUser = await User.findById(existUser._id);
                addUser.userPhoto = `/i-sell-admin-api/images/users/${existUser._id}/${userImage.photo.name}`;

                await addUser.save();

            });



        }//if req.files
        await existUser.save();

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

module.exports.GetAdmin = async (req,res)=>{

    let id = req.query.userId;

    if( isNaN(+id) ){
        id = req.session.passport.user._id;
    }//if

    let validIdUser = validator.isMongoId(id)||'';
    if(!validIdUser){

        Response.status = 400;
        Response.message = 'не корректное значени!';
        res.status(Response.status);
        res.send(Response);
        return;

    }//if

    try {


        let existUser = await User.findOne({_id: id},'userName userLastname userPhoto userLogin role userPhone userEmail');

        if(!existUser){

            Response.status = 400;
            Response.message = 'не корректное значени!';
            res.status(Response.status);
            res.send(Response);
            return;

        }//if

        let roleUser = await UserRole.findOne({_id: existUser.role});

        if(roleUser.userRoleId==1 || roleUser.userRoleId==2){

            let curentAdmin = await Admin.findOne({userBase: existUser._id});
            console.log(curentAdmin);
            Response.status = 200;
            Response.message = 'OK!';
            Response.data = {"curentAdmin":curentAdmin, "userAdmin":existUser, "userRoleId":roleUser.userRoleId};
        }//if
        else{
            Response.status = 200;
            Response.message = 'Среди админов и модераторов такого пользователя нет!';
            Response.data = null;
        }

    }
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
    }

    res.status(Response.status);
    res.send(Response);

}//GetUser

module.exports.AddUserWithRole = async( req , res ) => {

    let validLogin =constValidator.USER_LOGIN_VALIDATOR.test( req.body.login)||'';
    let validEmail = constValidator.USER_EMAIL_VALIDATOR.test(req.body.email)||'';
    let validFirstName = constValidator.USER_FIRSTNAME_VALIDATOR.test(req.body.firstName)||'';
    let validLastName = constValidator.USER_LASTNAME_VALIDATOR.test(req.body.lastName)||'';
    let validPhone = constValidator.USER_PHONE_VALIDATOR.test(req.body.phone)||'';
    let validPassword = constValidator.USER_PASSWORD_VALIDATOR.test(req.body.password)||'';
    let userRole = req.body.role ||'';
    //let photo = req.body.photo ||'';
    try{
        //console.log(req);
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
                    //userPhoto:pathUserImage,
                });
                await newUser.save();
            }//try
            catch(ex){

                let message = UtilsController.MakeMongooseMessageFromError(ex);

                Response.status = 400;
                Response.message = message;

                res.status(Response.status);
                res.send(Response);

                return ;

            }//catch

            let pathUserImage=null;

            if(req.files){

                let userImage = req.files.valueOf();
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
                console.log(userImage);
                console.log(userImage.photo);


                userImage.photo.mv(`${path}/${userImage.photo.name}`, async function(err) {

                    if (err) {
                        console.log('FILE UPLOAD ERROR:', err);
                        return;
                    }//if

                    let addUser = await User.findById(newUser._id);
                    addUser.userPhoto = `/i-sell-admin-api/images/users/${newUser._id}/${userImage.photo.name}`;

                    let user = await addUser.save();

                    if (userRole == 1 || userRole == 2) {

                        let currentUser = null;

                        try {
                            currentUser = new Admin({
                                userBase: user._id
                            });
                            await currentUser.save();

                            Response.status = 200;
                            Response.message = `Добавление админа или модератора прошло успешно, проверьте email: ${currentUser.userEmail}`;
                            Response.data = null;

                            res.status(Response.status);
                            res.send(Response);
                        }
                        catch (ex) {
                            let message = UtilsController.MakeMongooseMessageFromError(ex);

                            Response.status = 400;
                            Response.message = message;

                            res.status(Response.status);
                            res.send(Response);

                            return;
                        }

                    }//if
                    else {
                        Response.status = 200;
                        Response.message = `Добавление юзера успешно, проверьте email: ${addUser.userEmail}`;
                        Response.data = null;

                        res.status(Response.status);
                        res.send(Response);
                    }
                });



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

module.exports.GetUserList = async (req,res)=>{

    try{
        let limit = +req.query.limit || 10;
        let offset = +req.query.offset || 0;

        let status =await UserStatus.findOne({userStatusId: UserStatusEnum.NOT_VERIFIED});



        let users = await User.find({userStatus: status._id}, 'userName userLastname userPhoto userLogin')
            .limit(limit)
            .skip(offset);



        Response.status = 200;
        Response.message = 'Смотрите ЛОТЫ!!!!';
        Response.data = users;


    }//try
    catch(ex){

        console.log(ex);
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
        Response.data = ex.message;

    }//catch

    res.status(Response.status);
    res.send(Response);


};