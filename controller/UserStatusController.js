"use strict";

const UserStatus = require('../model/UserStatus');
const Logger = require('../model/Logger');
const constValidator = require('../model/Validation');
const UtilsController = require('../controller/UtilsController');
const Response = require('../model/Response');

module.exports.AddUserStatus = async( req , res ) => {

    try{

        let statusTitleValid = constValidator.TITLE_VALIDATOR.test(req.body.statusTitle);

        if(!statusTitleValid){

            Response.status = 400;
            Response.message = 'не корректное значени!';
            Response.data = statusTitleValid;
            res.status(Response.status)
            res.send(Response);
            return;
        }

        let existStatus= await UserStatus.findOne({
            statusTitle:req.body.statusTitle
        });//existStatus

        if(existStatus){
            Response.status = 400;
            Response.message = 'значение уже существует!';
            Response.data = statusTitleValid;
            res.status(Response.status)
            res.send(Response);

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

        Response.status = 200;
        Response.message = 'Добавление статуса успешно!';
        Response.data = createUserStatusResult;
        res.status(Response.status)
        res.send(Response);


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

        Response.status = 500;
        Response.message = 'Внутренняя ошибка сервера!';
        Response.data = null;
        res.status(Response.status)
        res.send(Response);

    } // Catch

}; // AddStatus

module.exports.removeUserStatus = async(req,res)=>{

    let idStatusDeal = req.body.StatusID;

    let validIdStatus = validator.isMongoId(idStatusDeal);

    if(!validIdStatus){
        Response.status = 400;
        Response.message = 'не корректное значени!';
        Response.data = idStatusDeal;
        res.status(Response.status)
        res.send(Response);
        return;
    }//if
    try{
        let existStatus= await UserStatus.find({
            id:idStatusDeal
        }).populate('users');//existStatus

        if(!existStatus){
            Response.status = 400;
            Response.message = 'не корректное значени!';
            Response.data = idStatusDeal;
            res.status(Response.status)
            res.send(Response);

            return;
        }//if

        if(!existStatus.users.length===0){
            Response.status = 400;
            Response.message = 'статус задействован в работе, выведите статус из работы и повторите попытку';
            Response.data = existStatus;
            res.status(Response.status)
            res.send(Response);

            return;
        }//if
        let removeStatus = await existStatus.remove({
            id:idStatusDeal
        });

        Response.status = 200;
        Response.message = 'Удаление статуса успешно!';
        Response.data = existStatus;
        res.status(Response.status)
        res.send(Response);

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
        res.status(Response.status)
        res.send(Response);

    }//catch
}//removeUserStatus


module.exports.updateStatusDeal = async (req,res)=>{
    let idStatusDeal = req.body.StatusID;
    let newTitle = req.body.newStatusTitle;
    let validIdStatus = validator.isMongoId(idStatusDeal);
    let validTitle = constValidator.TITLE_VALIDATOR.test(newTitle);

    if(!validIdStatus||!validTitle){
        Response.status = 400;
        Response.message = 'не корректное значени!';

        res.status(Response.status)
        res.send(Response);
        return;
    }
    try {
        let existStatus= await UserStatus.find({
            id:idStatusDeal
        });//existStatus
        if(!existStatus){
            Response.status = 400;
            Response.message = 'не корректное значени!';
            res.status(Response.status)
            res.send(Response);
            return;
        }//if
        existStatus.set({
            titleStatus:newTitle
        });

        let updateTitle = await existStatus.save();
        Response.status = 200;
        Response.message = 'Обновление статуса успешно!';
        res.status(Response.status)
        res.send(Response);
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
        res.status(Response.status)
        res.send(Response);

    }//catch

}//updateUserStatus
module.exports.ListStatus = async(req,res)=>{
    try{
        let listStatus = UserStatus.find().populate('statusTitle');

        Response.status = 200;
        Response.message = 'OK';
        Response.data=listStatus
        res.status(Response.status)
        res.send(Response);

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
        Response.status = 500;
        Response.message = 'Внутренняя ошибка сервера!';
        Response.data = null;
        res.status(Response.status)
        res.send(Response);

    }
}//ListStatus