"use strict";

const User = require('../../model/User');
const Admin = require('../../model/Admin');
const UserRole = require('../../model/UserRole');
const UserStatus = require('../../model/UserStatus');

const UserRoleEnum = require('../../model/Enums/UserRole');
const UserStatusEnum = require('../../model/Enums/UserStatus');
const Category = require('../../model/Category');
const lotImagePath = require('../../model/LotImage');
const Logger = require('../../model/Logger');

const UtilsController = require('../UtilsController');
const bcrypt = require('bcrypt');
const Response = require('../../model/Response');
const constValidator = require('../../model/Validation');
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

        if(!validLogin){
            Response.status = 400;
            Response.message = 'не корректны логин !';
            res.status(Response.status);
            res.send(Response);
            return;
        }//if

        if(!validEmail){
            Response.status = 400;
            Response.message = 'не корректны еmail !';
            res.status(Response.status);
            res.send(Response);
            return;
        }//if

        if(!validFirstName){
            Response.status = 400;
            Response.message = 'не корректное имя !';
            res.status(Response.status);
            res.send(Response);
            return;
        }//if

        if(!validLastName){
            Response.status = 400;
            Response.message = 'не корректная фамилия !';
            res.status(Response.status);
            res.send(Response);
            return;
        }//if

        if(!validPhone){
            Response.status = 400;
            Response.message = 'не корректны телефон !';
            res.status(Response.status);
            res.send(Response);
            return;
        }//if
        if(!validPassword){
            Response.status = 400;
            Response.message = 'не корректны пароль !';
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
                userCountSum: 0
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

    let id = req.session.passport.user._id;
    let email = req.body.email||'';
    let firstName = req.body.firstName||'';
    let lastName =req.body.lastName||'';
    let phone = req.body.phone||'';
    let oldPassword = req.body.oldPassword||'';
    let newPassword = req.body.newPassword||'';

    let errors = [];

    let role = req.body.role;
    let status = req.body.userStatus;


    try {


        let existUser = await User.findOne({_id:id});


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


        let validPasswordOld = constValidator.USER_PASSWORD_VALIDATOR.test(oldPassword)||'';
        let validPasswordNew = constValidator.USER_PASSWORD_VALIDATOR.test(newPassword)||'';

        if(validPasswordOld && validPasswordNew ) {

            let compare = await bcrypt.compare(oldPassword ,existUser.userPassword );


            if(compare === true ){

                let number = Math.floor(Math.random() * (19 - 9+1) ) + 5 //генерируем случайное число символов от 9 до 19
                let saltStr = await bcrypt.genSalt(number);// создаем соль
                let newHexPassword = await bcrypt.hash(newPassword, saltStr); // получаем закодированный пароль
                existUser.userPassword = newHexPassword

            }//if


       }//if

        let updateUser = await existUser.save();

        Response.status = 200;
        Response.message = 'обновления прошли успешно!';
        Response.data = updateUser

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

    console.log('image', req.files);

    let userId = req.session.passport.user._id
    let validIdUser = validator.isMongoId(userId);

    if(!validIdUser){

        Response.status = 400;
        Response.message = 'не корректное значени!';

        res.status(Response.status);
        res.send(Response);
        return;

    }//if
    try {
        let existUser = await User.findOne({
            _id:userId
        },'_id');

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

                if(!fs.existsSync(`public/images/avatar/${existUser._id}`)){
                    fs.mkdirSync(`public/images/avatar/${existUser._id}`);
                }
                if(!fs.existsSync(existUser.userPhoto)) {
                    userAvatar.mv(`${path}/${userAvatar.name}`, async function (error) {
                        if (error){
                            let message = UtilsController.MakeMongooseMessageFromError(error);
                            Response.status = 500;
                            Response.message = message;
                            res.status(Response.status)
                            res.send(Response);
                            return;
                        }//if

                        existUser.userPhoto =`/i-sell-admin-api/images/avatar/${existUser._id}/${userAvatar.name}`

                        await existUser.save();

                    });

                }//if
                else{
                    fe.remove(existUser.userPhoto, async function (err) {
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

                                console.log(path);

                            });
                        }

                    });
                }//else
                console.log( 'USER',existUser);
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
            Response.status = 401;
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
    let validIdUser = validator.isMongoId(req.session.passport.user._id)||'';

    if(!validIdUser){

        Response.status = 400;
        Response.message = 'не корректное значени!';
        res.status(Response.status);
        res.send(Response);
        return;

    }//if

    let userId = req.session.passport.user._id;
    try {

        let existUser = await User.find({
            id:userId
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

module.exports.GetUser = async (req,res)=>{

    let id = req.query.userId;

    if(id === req.session.passport.user._id){
        Response.status = 200;
        Response.message = 'запрос на себя!';
        Response.data = null;
        res.status(Response.status);
        res.send(Response);
        return;
    }//if
    if( !isNaN(+id) ){
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

        let existUser = await User.findOne({_id:id},'_id userLogin userEmail userName userLastname userPhoto userPhone userCountSum');

        if(!existUser){

            Response.status = 400;
            Response.message = 'не корректное значени!';
            res.status(Response.status);
            res.send(Response);
            return;

        }//if



        Response.status = 200;
        Response.message = 'OK!';
        Response.data = existUser;
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

module.exports.GetUserBuyLot = async(req,res)=>{

    let id = req.session.passport.user._id||'';

    let lotStatus = +req.body.idStatus||'';

    if(req.session.passport === undefined){
        Response.status = 400;
        Response.message = 'не корректное значени!';
        res.status(Response.status);
        res.send(Response);
        return;
    }
    let validIdUser = validator.isMongoId(id)||'';
    if(!validIdUser){

        Response.status = 400;
        Response.message = 'не корректный пользователь!';
        res.status(Response.status);
        res.send(Response);
        return;

    }//if


    let limit = req.body.limit||0;
    let offset = req.body.offset||10;

    try{

        let Lots = await User
            .findOne({_id:id},'_id')
            .populate({
                path: 'lots',
                match: {
                    customer: id,
                    statusLot:lotStatus
                }
            });


        Response.status = 200;
        Response.message = 'OK!';
        Response.data = Lots;
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

}//GetUserBuyActiveLot

module.exports.GetUserSaleLot = async (req,res)=>{
    let id = req.session.passport.user._id||'';

    let lotStatus = +req.body.idStatus;

    if(req.session.passport === undefined){
        Response.status = 400;
        Response.message = 'не корректное значени!';
        res.status(Response.status);
        res.send(Response);
        return;
    }
    let validIdUser = validator.isMongoId(id)||'';
    if(!validIdUser){

        Response.status = 400;
        Response.message = 'не корректный пользователь!';
        res.status(Response.status);
        res.send(Response);
        return;

    }//if




    let limit = req.body.limit||0;
    let offset = req.body.offset||10;
    try{

        let Lots = await User
            .findOne({_id:id},'_id')
            .populate({
                path: 'lots',
                match: {
                    seller: id,
                    statusLot:lotStatus
                }
            });

        // let Lots = await User
        //     .findById(id , {
        //         skip: offset,
        //         limit: limit
        //     }, '')
        //     .populate({
        //         path: 'lots',
        //         match: {
        //             seller: id,
        //             statusLot:lotStatus
        //         }
        //     });

        for(let i=0;i<Lots.lots.length;i++){

            let category= Lots.lots[i].categories;
            let titleCategory =[];
            for(let i=0;i<category.length;i++){

                let title = await Category.findOne({_id:category[i]},'title');

                titleCategory.push(title);
            }//for

            Lots.lots[i].categories = titleCategory;

            if(Lots.lots[i].lotImagePath.length>0){
                let imageId = Lots.lots[i].lotImagePath[0];

                let imagePath = await lotImagePath.find({_id : imageId},'path');
                Lots.lots[i].lotImagePath = imagePath;
            }//if

             await Lots.lots[i].getLikes();
             await Lots.lots[i].getDisLike();
        }//for


        Response.status = 200;
        Response.message = 'OK!';
        Response.data = Lots;
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
}//GetUserSaleActiveLot



