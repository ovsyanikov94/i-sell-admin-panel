"use strict";

const Role = require('../model/Role');
const Logger = require('../model/Logger');

const UtilsController = require('../controller/UtilsController');

module.exports.AddRole = async( req , res ) => {

    try{

        let roleTitle = req.body.roleTitle;

        let newRole = null;

        try {

            newRole = new Role({
                roleTitle: roleTitle
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

        let createRoleResult = await newRole.save();

        res.status(200);
        res.send({
            code: 200,
            data: createRoleResult,
            message:  'Добавление роли прошло успешно!'
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