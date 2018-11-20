"use strict";

const LotType = require('../model/LotType');
const Logger = require('../model/Logger');
const Response = require('../model/Response');

module.exports.LotTypeList = async( req , res )=>{

    try{
        let limit = req.query.limit || 10;
        let offset = req.query.offset || 0;

        let type = await LotType.find();

        Response.status = 200;
        Response.message = 'Смотрите типы лотов!!!!';
        Response.data = type;


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
        Response.message = 'Внутренняя типы сервера!';
        Response.data = ex.message;

    }//catch

    res.status(Response.status);
    res.send(Response);


};

module.exports.LotTypeByID = async( req , res )=>{

    try{
        let id = req.query.id;

        if(!id){
            Response.status = 400;
            Response.message = 'id типа лота не заданю';
            Response.data = id;

            res.status(Response.status);
            res.send(Response);

            return ;
        }
        let type = await LotType.findOne({typeID: id}, 'typeTitle typeID');

        Response.status = 200;
        Response.message = 'Смотрите типы лотов!!!!';
        Response.data = type;


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


};