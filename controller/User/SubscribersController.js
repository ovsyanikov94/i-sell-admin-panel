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

            //Если добавляем первый раз
            if(!existUser.subscribersList ){

                let newSubscribers = new subscribers({
                    user: id,
                    MySubscribersList: [ userIdSubscribers ]
                });

                await newSubscribers.save();

                existUser.subscribersList = newSubscribers._id;

                await existUser.save();

            }//if добавляем id пользователя на странице которого находимся

            if(!existUserSubscriberskList.subscribersList){

                let newSubscribers = new subscribers({
                    user: userIdSubscribers,
                    MySubscriptionsList: [ id ]
                });

                await newSubscribers.save();

                existUserSubscriberskList.subscribersList = newSubscribers._id;

                await existUserSubscriberskList.save();
            }//if добавляем id текушего авторизированного пользователя в список подписок пользователя на странице которого находимся
        }//try
        catch (ex){

            let message = UtilsController.MakeMongooseMessageFromError(ex);

            Response.status = 400;
            Response.message = message;

            res.status(Response.status);
            res.send(Response);

            return ;

        }


        let subscribersListAuthorizedUser = await subscribers.findOne({
            user: id
        });//получаем авторезированного пользователя

        let  subscribersListInProfileUser = await subscribers.findOne({
            user: userIdSubscribers
        });// получаем пользователя на странице профиля которого находимся

        console.log('subscribersListAuthorizedUser.MySubscribersList: ' , subscribersListAuthorizedUser.MySubscribersList);

        if(subscribersListAuthorizedUser.MySubscribersList.indexOf(userIdSubscribers) === -1){

            subscribersListAuthorizedUser.MySubscribersList.push(userIdSubscribers);
            await subscribersListAuthorizedUser.save();

        }//if
        else{

            Response.status = 200;
            Response.message = 'вы уже подписаны на пользователя';
            Response.data = true;

        }//else

        if(subscribersListInProfileUser.MySubscriptionsList.indexOf(id) === -1){

            subscribersListInProfileUser.MySubscriptionsList.push(id);
            await subscribersListInProfileUser.save();

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
};

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


        let subscribersListAuthorizedUser = await subscribers.findOne({
            user: userId
        });//получаем авторезированного пользователя

        let  subscribersListInProfileUser = await subscribers.findOne({
            user: userIdSubscribers
        });// получаем пользователя на странице профиля которого находимся

        if(subscribersListAuthorizedUser!==null &&
            subscribersListInProfileUser !== null&&
            subscribersListAuthorizedUser.MySubscribersList !==null&&
            subscribersListInProfileUser.MySubscriptionsList != null
        ){
            if (subscribersListAuthorizedUser.MySubscribersList.indexOf(userIdSubscribers) !== -1
                //проверяем наличие юзера на странице профиля которого находимся в списке подписок авторезированного юзера
                && subscribersListInProfileUser.MySubscriptionsList.indexOf(userId) !== -1){
                // проверяем наличие авторезированного юзера в списке подписок юзера на странице профиля которого находимся
                subscribersListAuthorizedUser.MySubscribersList.remove(userIdSubscribers);
                await subscribersListAuthorizedUser.save();

                subscribersListInProfileUser.MySubscriptionsList.remove(userId);
                await subscribersListInProfileUser.save();

                Response.status = 200;
                Response.message = 'пользователь удален из списка!';
                Response.data = true;

            }//if

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
};

module.exports.InListSubscribers = async(req,res)=>{
    let id= req.session.passport.user._id;


    let validUser =  validator.isMongoId( id);
    let validUserInSubscriberskList =  validator.isMongoId( req.query.UserIDInSubscribersList);


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

    let userIdSubscribers = req.query.UserIDInSubscribersList;

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

            res.status(Response.status);
            res.send(Response);
            return;
        }//if

        let subscribersList = await subscribers.findOne(
            {
                user:  existUser._id
            }
        );

        console.log('subscribersList',subscribersList);

        Response.status = 200;
        Response.message = 'OK';

        if(subscribersList && subscribersList.MySubscribersList.indexOf(userIdSubscribers) === -1){
            Response.data = false;
        }//if
        else if(subscribersList && subscribersList.MySubscribersList.indexOf(userIdSubscribers) !== -1 ){
            Response.data = true;
        }//else
        else{
            Response.data = false;
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

        Response.status = 500;
        Response.message = 'Внутренняя ошибка сервера!';
        Response.data = null;

    }//catch

    res.status(Response.status);
    res.send(Response);

}//getInListSubscribers

module.exports.getSubscribersUser = async (req,res)=>{
    let id = req.query.userId;

    if( !isNaN(+id) ){
        id = req.session.passport.user._id;
    }//if

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
                    path:'MySubscribersList',
                    options:{
                        limit: limit,
                        skip: offset
                    },
                    select:'userLogin userName userLastname userPhoto'
                },

            });

        if(subscribers && subscribers.subscribersList && subscribers.subscribersList.MySubscribersList){
            let List = subscribers.subscribersList.MySubscribersList;
            Response.data = List;
        }//if
        else{
            Response.data = null;
        }
        Response.status = 200;
        Response.message = 'OK';

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
                    path:'MySubscriptionsList',
                    options:{
                        limit: limit,
                        skip: offset
                    },
                    select:'userLogin userName userLastname userPhoto'
                },

            });

        console.log('subscribers', subscribers);
        if(subscribers && subscribers.subscribersList && subscribers.subscribersList.MySubscriptionsList ){
            let List = subscribers.subscribersList.MySubscriptionsList;
            Response.data = List;
        }//if
        else{
            Response.data = null;
        }
        Response.status = 200;
        Response.message = 'OK';

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