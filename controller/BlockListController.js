'use strict'

const Logger = require('../model/Logger');
const UtilsController = require('../controller/UtilsController');
const blockList = require('./blockListUser');
const User = require('../model/User');
const validator = require('validator');

module.exports.AddUserToBlockList=async(req,res)=>{

    let validUser =  validator.isMongoId( req.body.UserID);
    let validUserInBlackList =  validator.isMongoId( req.body.UserIDInBlackList);

    if(!validUser||
        !validUserInBlackList
    ){
        res.send( {
            code: 400,
            message: "не корректное значени!",
            data: idStatusDeal
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

        let blackList = await blockList({
            user:req.body.UserID
        });

        blockList.blockList.push(req.body.UserIDInBlackList);

        await blackList.save();
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

        let blackList = await blockList({
            user:req.body.UserID
        });

        let idInBlackList =  blockList.blackList.remove(req.body.UserIDInBlackList);

        await blockList.save();
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