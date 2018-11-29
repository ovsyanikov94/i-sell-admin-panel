'use strict'

const Logger = require('../../model/Logger');
const UtilsController = require('../UtilsController');
const subscribers = require('../../model/subscribersUser');
const User = require('../../model/User');
const validator = require('validator');
const Response = require('../../model/Response');

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

        subscribersList.List.push(req.body.UserIDInSubscribersList);

        await subscribersList.save();
        Response.status = 200;
        Response.message = 'обновления прошли успешно!';
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
    let validUserInSubscribersList =  validator.isMongoId( req.body.UserIDInSubscribersList);

    if(!validUser||
        !validUserInSubscribersList
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

        let existUserSubscribersList = await User.find({

            id:req.body.UserIDInSubscribersList
        });

        if(!existUser||
            !existUserSubscribersList
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

        let idInSubscribers =  subscribersList.List.remove(req.body.UserIDInSubscribersList);

        await subscribersList.save();
        Response.status = 200;
        Response.message = 'обновления прошли успешно!';

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

    }//catch
    res.status(Response.status)
    res.send(Response);
}

module.exports.getSubscribersUser = async (req,res)=>{

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

        let limit = +req.query.limit || 5;
        let offset = +req.query.offset || 0;

        let subscribers = await subscribers.find( {
            id:existUser.id
            } , {
            limit: limit,
            skip: offset
        });


        //console.log('categories' , categories);

        Response.status = 200;
        Response.message = 'обновления прошли успешно!';
        Response.data = subscribers;

    }//try
    catch (ex) {
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


    }//catch
    res.status(Response.status)
    res.send(Response);
}