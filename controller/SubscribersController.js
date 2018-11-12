'use strict'

const Logger = require('../model/Logger');
const UtilsController = require('../controller/UtilsController');
const subscribers = require('./SubscribersController');
const User = require('../model/User');
const validator = require('validator');


module.exports.AddUserToSubscribers=async(req,res)=>{

    let validUser =  validator.isMongoId( req.body.UserID);
    let validUserInSubscriberskList =  validator.isMongoId( req.body.UserIDInSubscribersList);

    if(!validUser||
        !validUserInSubscriberskList
    ){
        res.send( {
            code: 400,
            message: "не корректное значени!",
            data: null
        } );
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
            res.send( {
                code: 400,
                message: "не корректное значени!",
                data: null
            } );
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

        res.send( {
            code: 500,
            message: "Внутренняя ошибка сервера!",
            data: ex
        } );// res.send
    }//catch
}
module.exports.RemoveUserToSubscribers=async(req,res)=>{

    let validUser =  validator.isMongoId( req.body.UserID);
    let validUserInSubscriberskList =  validator.isMongoId( req.body.UserIDInSubscribersList);

    if(!validUser||
        !validUserInSubscriberskList
    ){
        res.send( {
            code: 400,
            message: "не корректное значени!",
            data: null
        } );
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
            res.send( {
                code: 400,
                message: "не корректное значени!",
                data: null
            } );
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

        res.send( {
            code: 500,
            message: "Внутренняя ошибка сервера!",
            data: ex
        } );// res.send
    }//catch
}