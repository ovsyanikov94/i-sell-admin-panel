"use strict";

const LotStatus = require('../model/LotStatus');
const Logger = require('../model/Logger');
const Response = require('../model/Response');
module.exports.AddLotStatus = async( req , res )=>{

    try{

        let title = req.body.statusTitle;

        let newStatus= new LotStatus({
            'statusTitle': title
        });

        let result = await newStatus.save();

        res.send({
            code: 200,
            data: result,
            message:  'Статус добавлен!'
        });


    }//try
    catch(ex){

        res.send( ex.message );

    }//catch

};//AddLotStatus


module.exports.GetListLotStatusBuy = async (req,res)=>{///ИСПРАВИТЬ!!

    try {
        let listLotStatus = await LotStatus.find(null,'id statusTitle',{
            $or:[
                {_id : 1},
                {_id : 4}
            ]
        });

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
        let listLotStatus = await LotStatus.find(null,'id statusTitle');

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