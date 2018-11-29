'use strict'

const Logger = require('../../model/Logger');
const UtilsController = require('../UtilsController');
const blockList = require('../../model/blockList');
const User = require('../../model/User');
const validator = require('validator');
const Response = require('../../model/Response');

module.exports.AddUserToBlockList=async(req,res)=>{

    let validUser =  validator.isMongoId( req.body.UserID);
    let validUserInBlackList =  validator.isMongoId( req.body.UserIDInBlackList);

    if(!validUser||
        !validUserInBlackList
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

        let existUserBlockList = await User.find({

            id:req.body.UserIDInBlackList
        });

        if(!existUser||
            !existUserBlockList
        ){
            Response.status = 400;
            Response.message = 'значение уже существует!';
            Response.data = statusTitleValid;
            res.status(Response.status)
            res.send(Response);
            return;
        }//if

        let blockListUser = await blockList({
            user:req.body.UserID
        });

        blockListUser.List.push(req.body.UserIDInBlackList);

        await blockListUser.save();
        res.status(200);
        res.send({
            code: 200,
            data: req.body.UserIDInBlackList,
            message:  'пользователь добавлен в список блокированых'
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

module.exports.RemoveUserToBlockList=async(req,res)=>{

    let validUser =  validator.isMongoId( req.body.UserID);
    let validUserInBlackList =  validator.isMongoId( req.body.UserIDInBlackList);

    if(!validUser||
        !validUserInBlackList
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

        let existUserBlackList = await User.find({

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

        let blockListUser = await blockList({
            user:req.body.UserID
        });

        let idInBlackList = blockListUser.List.remove(req.body.UserIDInBlackList);

        await blockListUser.save();
        res.status(200);
        res.send({
            code: 200,
            data: req.body.UserIDInBlackList,
            message:  'пользователь удален из списа блокированых'
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


module.exports.getBlackListUser = async (req,res)=>{

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

        let blockListUser = await blockList.find( {
            id:existUser.id
        } , {
            limit: limit,
            skip: offset
        });


        //console.log('categories' , categories);

        Response.status = 200;
        Response.message = 'обновления прошли успешно!';

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