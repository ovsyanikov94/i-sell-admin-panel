"use strict";

const LotType = require('../model/LotType');
const Logger = require('../model/Logger');
const Response = require('../model/Response');

module.exports.LotTypeList = async( req , res )=>{

    try{
        let limit = req.query.limit || 10;
        let offset = req.query.offset || 0;

        let status = await LotType.find();

        Response.status = 200;
        Response.message = 'Смотрите статусы лотов!!!!';
        Response.data = {
            status: status,
            userId:  req.session.passport.user
        };


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
