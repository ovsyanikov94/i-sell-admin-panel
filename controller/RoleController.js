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

module.exports.GetRoleByID = async(req,res)=>{
    try{
        let id = req.query.id;

        if(!id){
            Response.status = 400;
            Response.message = 'id роли не задан';
            Response.data = id;

            res.status(Response.status);
            res.send(Response);

            return ;
        }
        let role = await UserRole.findOne({userRoleId: id}, 'roleTitle userRoleId');

        Response.status = 200;
        Response.message = 'Роль определена.';
        Response.data = role;


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


};//GetRoleByID