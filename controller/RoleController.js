"use strict";

const UserRole = require('../model/UserRole');
const Logger = require('../model/Logger');

const UtilsController = require('../controller/UtilsController');

module.exports.ListRoles = async(req,res)=>{
    try{
        let listRole = UserRole.find().populate('roleTitle');

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
