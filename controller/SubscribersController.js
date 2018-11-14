'use strict'

const Logger = require('../model/Logger');
const UtilsController = require('../controller/UtilsController');
const subscribers = require('../model/subscribersUser');
const User = require('../model/User');
const validator = require('validator');
const Response = require('../model/Response');

module.exports.AddUserToSubscribers=async(req,res)=>{

    let validUser =  validator.isMongoId( req.body.UserID);
    let validUserInSubscriberskList =  validator.isMongoId( req.body.UserIDInSubscribersList);

    if(!validUser||
        !validUserInSubscriberskList
    ){
        Response.status = 400;
        Response.message = 'значение уже существует!';
        Response.data = statusTitleValid;
        res.status(Response.status)
        res.send(Response);
        return;
    }//if

    try {

        let existUser = await User.find({

            id:req.body.UserID
        });

        let existUserSubscriberskList = await User.find({

            id:req.body.UserIDInBlackList
        });

        if(!existUser||
            !existUserBlackList
        ){
            Response.status = 400;
            Response.message = 'значение уже существует!';
            Response.data = statusTitleValid;
            res.status(Response.status)
            res.send(Response);
            return;
        }//if

        let subscribersList = await subscribers({
            user:req.body.UserID
        });

        subscribersList.blackList.push(req.body.UserIDInSubscribersList);

        await blackList.save();
        res.status(200);
        res.send({
            code: 200,
            data: req.body.UserIDInBlackList,
            message:  'пользователь добавлен в подписчики'
        });// res.send

    }//try
    catch (ex){
        Logger.error({
            time: new Date().toISOString(),
            status: 500,
            data: {
                message: ex.message,
                stack: ex.stack
            },
        });//Logger.error
        res.status(500);

        Response.status = 500;
        Response.message = 'Внутренняя ошибка сервера!';
        Response.data = null;
        res.status(Response.status)
        res.send(Response);
    }//catch
}
module.exports.RemoveUserToSubscribers=async(req,res)=>{

    let validUser =  validator.isMongoId( req.body.UserID);
    let validUserInSubscriberskList =  validator.isMongoId( req.body.UserIDInSubscribersList);

    if(!validUser||
        !validUserInSubscriberskList
    ){
        Response.status = 400;
        Response.message = 'значение уже существует!';
        Response.data = statusTitleValid;
        res.status(Response.status)
        res.send(Response);
        return;
    }//if

    try {

        let existUser = await User.find({

            id:req.body.UserID
        });

        let existUserSubscriberskList = await User.find({

            id:req.body.UserIDInBlackList
        });

        if(!existUser||
            !existUserBlackList
        ){
            Response.status = 400;
            Response.message = 'значение уже существует!';
            Response.data = statusTitleValid;
            res.status(Response.status)
            res.send(Response);
            return;
        }//if

        let subscribersList = await subscribers({
            user:req.body.UserID
        });

        let idInSubscribers =  subscribersList.blackList.remove(req.body.UserIDInSubscribersList);

        await blackList.save();
        res.status(200);
        res.send({
            code: 200,
            data: req.body.UserIDInBlackList,
            message:  'пользователь удален из подписчиков'
        });// res.send

    }//try
    catch (ex){
        Logger.error({
            time: new Date().toISOString(),
            status: 500,
            data: {
                message: ex.message,
                stack: ex.stack
            },
        });//Logger.error
        res.status(500);

        Response.status = 500;
        Response.message = 'Внутренняя ошибка сервера!';
        Response.data = null;
        res.status(Response.status)
        res.send(Response);
    }//catch
}