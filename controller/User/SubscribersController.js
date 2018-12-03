'use strict'
const mongoose = require('mongoose');
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
        Response.message = 'пользователь не найден!';
        res.status(Response.status)
        res.send(Response);
        return;
    }//if
    let userIdSubscribers = req.body.UserIDInSubscribersList;

    if(id===userIdSubscribers){
        Response.status = 401;
        Response.message = 'нельзя подписаться на самого себя!';
        Response.data = null;
        res.status(Response.status)
        res.send(Response);
        return;
    }//if
    try {

        let existUser = await User.findOne({
            _id:id
        });

        let existUserSubscriberskList = await User.findOne({

            _id:userIdSubscribers
        });

        if(!existUser||
            !existUserSubscriberskList
        ){
            Response.status = 400;
            Response.message = 'пользователь не найден!';
            res.status(Response.status)
            res.send(Response);
            return;
        }//if

        try{



            if(!existUser.subscribersList ){
                let newSubscribers = new subscribers({
                    user: id
                });
                await newSubscribers.save();
                existUser.subscribersList = (newSubscribers._id);
                await existUser.save();
            }//if


        }//try
        catch (ex){

            let message = UtilsController.MakeMongooseMessageFromError(ex);

            Response.status = 400;
            Response.message = message;

            res.status(Response.status);
            res.send(Response);

            return ;

        }


        let subscribersList = await subscribers.findOne({
            user: id
        });

        console.log('subscribersList',subscribersList);
        console.log('subscribersList!!!!!!!!!!!!!!!!!!!!!',subscribersList.List);
        console.log('indexOf' ,subscribersList.List.indexOf(userIdSubscribers));
        if(subscribersList.List.indexOf(userIdSubscribers)===-1){
            subscribersList.List.push(userIdSubscribers);
            await subscribersList.save();




            Response.status = 200;
            Response.message = 'пользователь добавлен в подписчики';
            Response.data = true;
        }//if
        else{
            Response.status = 200;
            Response.message = 'вы уже подписаны на пользователя';
            Response.data = true;
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
        });//Logger.error
        res.status(500);

        Response.status = 500;
        Response.message = 'Внутренняя ошибка сервера!';
        Response.data = null;

    }//catch
    res.status(Response.status)
    res.send(Response);
}
module.exports.RemoveUserToSubscribers=async(req,res)=>{

    let userId = req.session.passport.user._id;
    let validUser =  validator.isMongoId( userId);
    let validUserInSubscribersList =  validator.isMongoId( req.body.UserIDInSubscribersList);



    if(!validUser||
        !validUserInSubscribersList
    ){
        Response.status = 400;
        Response.message = 'пользователь не найден!';
        res.status(Response.status)
        res.send(Response);
        return;
    }//if
    let userIdSubscribers = req.body.UserIDInSubscribersList;
    try {

        let existUser = await User.findOne({

            _id:userId
        },'_id');

        let existUserSubscribersList = await User.findOne({

            _id:userIdSubscribers
        },'_id');

        if(!existUser||
            !existUserSubscribersList
        ){
            Response.status = 400;
            Response.message = 'пользователь не найден!';
            res.status(Response.status)
            res.send(Response);
            return;
        }//if

        let subscribersList = await subscribers.findOne({
            user:userId
        });

        console.log('user', subscribersList);

        console.log('of', subscribersList.List.indexOf(userIdSubscribers));

        if(subscribersList.List.indexOf(userIdSubscribers)===0){
            let idInSubscribers =  subscribersList.List.remove(userIdSubscribers);

            await subscribersList.save();
            Response.status = 200;
            Response.message = 'пользователь удален из списка!';
            Response.data = false;
        }//if
        else{
            Response.status = 400;
            Response.message = 'пользователь не найден';
            Response.data = false;
        }//elsr

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

module.exports.InListSubscribers = async(req,res)=>{
    let id= req.session.passport.user._id;


    let validUser =  validator.isMongoId( id);
    let validUserInSubscriberskList =  validator.isMongoId( req.body.UserIDInSubscribersList);


    if(!validUser||
        !validUserInSubscriberskList
    ){
        Response.status = 400;
        Response.message = 'пользователь не найден!';
        Response.data = statusTitleValid;
        res.status(Response.status)
        res.send(Response);
        return;
    }//if
    let userIdSubscribers = req.body.UserIDInSubscribersList
    try {

        let existUser = await User.findOne({
            _id: id
        });

        let existUserSubscriberskList = await User.findOne({

            _id: userIdSubscribers
        });

        if (!existUser ||
            !existUserSubscriberskList
        ) {
            Response.status = 400;
            Response.message = 'пользователь не найден!';

            res.status(Response.status)
            res.send(Response);
            return;
        }//if

        let subscribersList = await subscribers.findOne({user:  existUser._id})
            .populate({
                path:'List',

                math:{
                    _id: userIdSubscribers
                },
                select:'userLogin userName userLastname userPhoto'
            });

        console.log('subscribersList',subscribersList);
        if(subscribersList.List.length === 0){
            Response.status = 200;
            Response.message = 'OK';
            Response.data = false;
            return;
        }
        if (subscribersList.List.length>0 && subscribersList.List[0]._id == userIdSubscribers ){
            Response.status = 200;
            Response.message = 'OK';
            Response.data = true;
        }//if
        else{

        }//else

    }
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
}//getInListSubscribers

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

        let subscribers = await User.findOne({
            _id: existUser._id
            },'_id')
            .populate({
                path:'subscribersList',
                populate:{
                    path:'List',
                    options:{
                        limit: limit,
                        skip: offset
                    },
                    select:'userLogin userName userLastname userPhoto'
                },

            });

        console.log('subscribers', subscribers);
        let List = subscribers.subscribersList.List;

        Response.status = 200;
        Response.message = 'обновления прошли успешно!';
        Response.data = List;

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
    let id = req.query.userId;

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

        let Subscriptions = await subscribers.find()
            .populate({
            path:'List',
            match:{
                _id : id
            },
            options:{
                limit: limit,
                skip: offset
            },
            select:'userLogin userName userLastname userPhoto'
    });


        // let resultUserId = Subscriptions.map((s)=>{
        //     return s.user
        // });
        let resultUserId=[];
        for(let i = 0; i< Subscriptions.length;i++) {
            if(Subscriptions[i].List.length>0){
                let user = Subscriptions[i].List;
                resultUserId.push(user);
            }//if

        }//for

        console.log('USER ID',resultUserId);
        let resultUserList = [];


        for(let i = 0; i<resultUserId.length; i++){
            console.log('USER',resultUserId[i]);
            let user = await User.findOne(
                {_id:resultUserId[i]},'_id userLogin  userName userLastname userPhoto ');

            resultUserList.push(user);

            console.log('USER',user);
        }



        Response.status = 200;
        Response.message = 'обновления прошли успешно!';
        Response.data = resultUserList;

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