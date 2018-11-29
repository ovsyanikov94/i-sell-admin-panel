"use strict";

const UserRole = require('../../model/UserRole');
const Logger = require('../../model/Logger');
const constValidator = require('../../model/Validation');
const UtilsController = require('../UtilsController');
const Response = require('../../model/Response');

module.exports.ListRoles = async(req,res)=>{
    console.log('service');
    try{
        //let limit = +req.query.limit || 10;
        //let offset = +req.query.offset || 0;

        let listRole = await UserRole.find();


        console.log(listRole);


        Response.status = 200;
        Response.message = 'OK';
        Response.data=listRole
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

module.exports.AddUserRole = async( req , res ) => {

    try{

        let roleTitleValid = constValidator.TITLE_VALIDATOR.test(req.body.roleTitle);

        if(!roleTitleValid){

            Response.status = 400;
            Response.message = 'Не корректное название роли пользователя!';
            Response.data = roleTitleValid;
            res.status(Response.status)
            res.send(Response);
            return;
        }

        let existRole= await UserRole.findOne({
            roleTitle:req.body.roleTitle
        });//existRole

        if(existRole){
            Response.status = 400;
            Response.message = 'Такая роль уже существует!';
            Response.data = roleTitleValid;
            res.status(Response.status)
            res.send(Response);

            return;
        }//if

        let newRole = null;

        try {

            newRole = new UserRole({
                'roleTitle':req.body.roleTitle
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

        let createUserRoleResult = await newRole.save();



        Response.status = 200;
        Response.message = 'Добавление роли успешно!';
        Response.data = createUserRoleResult;
        res.status(Response.status);
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

}; // AddUserRole