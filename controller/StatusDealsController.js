'use strict';

const Logger = require('../model/Logger');
const UtilsController = require('../controller/UtilsController');
const validator = require('validator');
const DealsStatus = require('../model/DealsStatus');
const constValidator = require('../model/validatorConstatn');

module.exports.createStatus = async(req,res)=>{
    let title = req.body.statusTitle;
    let validTitle = constValidator.STATUS_TITLE_VALIDATOR.test(title);

    if(!validTitle){
        res.send( {
            code: 400,
            message: "не корректное значени!",
            data: idStatusDeal
        } );
        return;
    }//if
    try {

        let newStatus = null;
        try{
            let newStatus = DealsStatus({
                titleStatus:title
            });//newStatus
        }//try
        catch(ex){
            let message = UtilsController.MakeMongooseMessageFromError(ex);

            res.status(400);
            res.send( {
                code: 400,
                message: message
            } );//res.send

            return;
        }//catch

        let existStatus= await DealsStatus.findOne({
            titleStatus:title
        });//existStatus

        if(existStatus){
            res.send( {
                code: 400,
                message: "значение уже существует!",
                data: title
            } );
            return;
        }//if

       let Status = await newStatus.send();

        res.status(200);
        res.send({
            code: 200,
            data: newStatus,
            message:  'Добавление статуса успешно!'
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
}//createStatus

module.exports.removeStatusDeal = async(req,res)=>{

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
        let existStatus= await DealsStatus.find({
            id:idStatusDeal
        }).populate('deals');//existStatus

        if(!existStatus){
            res.send( {
                code: 400,
                message: "не корректное значени!",
                data: idStatusDeal
            } );
            return;
        }//if

        if(!existStatus.deals.length===0){
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
}//removeStatusDeal

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
        let existStatus= await DealsStatus.find({
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

}//updateStatusDeal

module.exports.ListStatus = async(req,res)=>{
    try{
        let listStatus = DealsStatus.find().populate('titleStatus');
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
}

module.exports.ListStatusByID = async(req,res)=>{
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
        let listStatus = DealsStatus.find({
            id:idStatusDeal
        }).populate('deals');
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
}