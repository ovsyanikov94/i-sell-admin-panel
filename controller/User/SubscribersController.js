'use strict'

const Logger = require('../../model/Logger');
const UtilsController = require('../UtilsController');
const subscribers = require('../../model/subscribersUser');
const User = require('../../model/User');
const validator = require('validator');
const Response = require('../../model/Response');

module.exports.AddUserToSubscribers=async(req,res)=>{

    let id= req.session.passport.user._id;


    let validUser =  validator.isMongoId( id);
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
    let userIdSubscribers = req.body.UserIDInSubscribersList
    try {

        let existUser = await User.find({

            _id:id
        });

        let existUserSubscriberskList = await User.find({

            _id:userIdSubscribers
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

        subscribersList.List.push(userIdSubscribers);

        await subscribersList.save();
        Response.status = 200;
        Response.message = 'обновления прошли успешно!';
        Response.data = true;
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

    let userId = req.session.passport.user._id;
    let validUser =  validator.isMongoId( userId);
    let validUserInSubscribersList =  validator.isMongoId( req.body.UserIDInSubscribersList);

    let userIdSubscribers = req.body.UserIDInSubscribersList;

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

            _id:userId
        });

        let existUserSubscribersList = await User.find({

            _id:userIdSubscribers
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

        let idInSubscribers =  subscribersList.List.remove(userIdSubscribers);

        await subscribersList.save();
        Response.status = 200;
        Response.message = 'обновления прошли успешно!';
        Response.data = false;
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
    let id=null;
    if(req.body.userId){
        id = req.body.userId
    }
    else{
        id= req.session.passport.user._id;
    }
    console.log('id',id);
    let validIdUser = validator.isMongoId(id);

    if(!validIdUser){

        Response.status = 400;
        Response.message = 'переданы не корректное значени!';
        res.status(Response.status);
        res.send(Response);
        return;

    }//if
    try {

        let existUser = await User.findOne({
            _id: id
        });
        console.log('existUser',existUser);
        if(!existUser){

            Response.status = 400;
            Response.message = 'не корректное значени!';
            res.status(Response.status);
            res.send(Response);
            return;

        }//if

        let limit = +req.query.limit || 5;
        let offset = +req.query.offset || 0;
        console.log('subscribers');
        let subscribers = await User.findOne({
            _id: existUser._id
            })
            .limit(limit)
            .skip(offset)
            .populate({
                path:'subscribersList'
            },'userLogin userName userLastname userPhoto');


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
}//getSubscribersUser

module.exports.getSubscriptionsUser = async (req,res)=>{
    let id=null;
    if(req.body.userId){
        id = req.body.userId
    }
    else{
        id= req.session.passport.user._id;
    }


    let validIdUser = validator.isMongoId(id)||'';

    if(!validIdUser){

        Response.status = 400;
        Response.message = 'не корректное значени!';
        res.status(Response.status);
        res.send(Response);
        return;

    }//if
    try {

        let existUser = await User.findOne({
            _id:id
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

        let Subscriptions = await User.find()
            .populate({
            path:'subscribersList',
            match:{
                _id : id
            }
        });


        //console.log('categories' , categories);

        Response.status = 200;
        Response.message = 'обновления прошли успешно!';
        Response.data = Subscriptions;

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

 }//getSubscriptionsUser