"use strict";

const Lot = require('../model/Lot');
const Category = require('../model/Category');
const Logger = require('../model/Logger');

const UtilsController = require('../controller/UtilsController');

module.exports.AddLot = async( req , res ) => {

    try{

        let categories = req.body.categories;
        let lotTitle = req.body.lotTitle;
        let startPrice = +req.body.startPrice;

        let newLot = null;

        try {

            newLot = new Lot({
                title: lotTitle,
                startPrice: startPrice
            });

        }//try
        catch(ex){

            let message = UtilsController.MakeMongooseMessageFromError(ex);

            res.status(400);
            res.send( {
                code: 400,
                message: message
            } );

            return;

        }//catch

        categories.forEach( c => {
            newLot.categories.push( c );
        } );

        let createLotResult = await newLot.save();

        res.status(200);
        res.send({
            code: 200,
            data: createLotResult,
            message:  'Добавление лота успешно!'
        });


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

        res.status(500);

        res.send( {
            code: 500,
            message: "Внутренняя ошибка сервера!",
            data: ex
        } );

    }//catch

};