"use strict";

const LotStatus = require('../model/LotStatus');
const Logger = require('../model/Logger');
const Response = require('../model/Response');

module.exports.GetLotStatusById = async( req , res )=>{

    try{
        let id = req.query.id;

        if(!id){
            Response.status = 400;
            Response.message = 'id статуса лота не заданю';
            Response.data = id;

            res.status(Response.status);
            res.send(Response);

            return ;
        }
        let status = await LotStatus.findOne({statusID: id}, 'statusTitle statusID');

        Response.status = 200;
        Response.message = 'Смотрите статус лотов!!!!';
        Response.data = status;


    }//try
    catch(ex){

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
        Response.data = ex.message;

    }//catch

    res.status(Response.status);
    res.send(Response);

};//AddLotStatus


module.exports.GetListLotStatusBuy = async (req,res)=>{///ИСПРАВИТЬ!!

    try {
        let listLotStatus = await LotStatus.find({
            $or:[
                {statusID : 1},
                {statusID : 4}
            ]
        },'statusID statusTitle');

        Response.status = 200;
        Response.message = 'добавление прошли успешно!';
        Response.data = listLotStatus;
    }
    catch (ex){
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
    }
    res.status(Response.status);
    res.send(Response);
};//GetListLotStatus

module.exports.GetListLotStatusSale = async (req,res)=>{

    try {
        let listLotStatus = await LotStatus.find(null,'statusID statusTitle');

        Response.status = 200;
        Response.message = 'добавление прошли успешно!';
        Response.data = listLotStatus;
    }
    catch (ex){
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
    }
    res.status(Response.status);
    res.send(Response);
};//GetListLotStatus