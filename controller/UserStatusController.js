"use strict";

const UserStatus = require('../model/UserStatus');
const Logger = require('../model/Logger');
const constValidator = require('../model/Validation');
const UtilsController = require('../controller/UtilsController');

module.exports.AddUserStatus = async( req , res ) => {

    try{

        let statusTitleValid = constValidator.STATUS_TITLE_VALIDATOR.test(req.body.statusTitle);

        if(!statusTitleValid){
            res.send( {
                code: 400,
                message: "не корректное значени!",
                data: idStatusDeal
            } );
            return;
        }

        let existStatus= await UserStatus.findOne({
            statusTitle:req.body.statusTitle
        });//existStatus

        if(existStatus){
            res.send( {
                code: 400,
                message: "значение уже существует!",
                data: req.body.statusTitle
            } );
            return;
        }//if

        let newStatus = null;

        try {

            newStatus = new UserStatus({
                statusTitle: req.body.statusTitle
            });

        } // Try
        catch(ex){

            let message = UtilsController.MakeMongooseMessageFromError(ex);

            res.status(400);
            res.send( {
                code: 400,
                message: message
            } );

            return;

        } // Catch

        let createUserStatusResult = await newStatus.save();


        res.status(200);
        res.send({
            code: 200,
            data: createUserStatusResult,
            message:  'Добавление статуса успешно!'
        });

    } // Try
    catch (ex) {

        console.log(ex);

        Logger.error({
            time: new Date().toISOString(),
            status: 500,
            data: {
                message: ex.message,
                stack: ex.stack
            },
        });

        res.status(500);

        res.send( {
            code: 500,
            message: "Внутренняя ошибка сервера!",
            data: ex
        } );

    } // Catch

}; // AddStatus

module.exports.removeUserStatus = async(req,res)=>{

    let idStatusDeal = req.body.StatusID;

    let validIdStatus = validator.isMongoId(idStatusDeal);

    if(!validIdStatus){
        res.send( {
            code: 400,
            message: "не корректное значени!",
            data: idStatusDeal
        } );
        return;
    }//if
    try{
        let existStatus= await UserStatus.find({
            id:idStatusDeal
        }).populate('users');//existStatus

        if(!existStatus){
            res.send( {
                code: 400,
                message: "не корректное значени!",
                data: idStatusDeal
            } );
            return;
        }//if

        if(!existStatus.users.length===0){
            res.send( {
                code: 401,
                message: "статус задействован в работе, выведите статус из работы и повторите попытку",
                data: existStatus
            } );
            return;
        }//if
        let removeStatus = await existStatus.remove({
            id:idStatusDeal
        });
        res.status(200);
        res.send({
            code: 200,
            data: removeStatus.titleStatus,
            message:  'Удаление статуса успешно!'
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
}//removeUserStatus


module.exports.updateStatusDeal = async (req,res)=>{
    let idStatusDeal = req.body.StatusID;
    let newTitle = req.body.newStatusTitle;
    let validIdStatus = validator.isMongoId(idStatusDeal);
    let validTitle = constValidator.STATUS_TITLE_VALIDATOR.test(newTitle);

    if(!validIdStatus||!validTitle){
        res.send( {
            code: 400,
            message: "не корректное значени!",
            data: idStatusDeal
        } );
        return;
    }
    try {
        let existStatus= await UserStatus.find({
            id:idStatusDeal
        });//existStatus
        if(!existStatus){
            res.send( {
                code: 400,
                message: "не корректное значени!",
                data: title
            } );
            return;
        }//if
        existStatus.set({
            titleStatus:newTitle
        });

        let updateTitle = await existStatus.save();
        res.status(200);
        res.send({
            code: 200,
            data:updateTitle.titleStatus ,
            message:  'Обновление статуса успешно!'
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

}//updateUserStatus
module.exports.ListStatus = async(req,res)=>{
    try{
        let listStatus = UserStatus.find().populate('statusTitle');
        res.status(200);
        res.send({
            code: 200,
            data:listStatus ,
            message:  'OK'
        });// res.send
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

        res.send( {
            code: 500,
            message: "Внутренняя ошибка сервера!",
            data: ex
        } );// res.send
    }
}//ListStatus