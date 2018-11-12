"use strict";

const User = require('../model/User');
const Logger = require('../model/Logger');

const UtilsController = require('../controller/UtilsController');

module.exports.AddUser = async( req , res ) => {

    try{

        let login = req.body.login;
        let password = req.body.password;
        let email = req.body.email;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let image = req.body.image;
        let rating = +req.body.rating;
        let role = req.body.role;
        let phone = req.body.phone;
        let userStatus = req.body.userStatus;
        let lots = req.body.lots;

        let newUser = null;

        try {

            newUser = new User({
                login: login,
                password: password,
                email: email,
                firstName: firstName,
                lastName: lastName,
                image: image,
                rating: rating,
                phone: phone
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

        role.forEach( r => {
            newUser.role.push( r );
        } );

        userStatus.forEach( us => {
            newUser.userStatus.push( us );
        } );

        lots.forEach( l => {
            newUser.lots.push( l );
        } );

        let createUserResult = await newUser.save();

        res.status(200);

        res.send({
            code: 200,
            data: createUserResult,
            message:  'Добавление пользователя успешно!'
        });


    } // Try
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

        res.status(500);

        res.send( {
            code: 500,
            message: "Внутренняя ошибка сервера!",
            data: ex
        } );

    } // Catch

}; // AddUser