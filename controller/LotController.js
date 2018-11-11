"use strict";

const Lot = require('../model/Lot');
const Category = require('../model/Category');
const User = require('../model/User');
const CoordMap = require('../model/CoordMap');
const LotType = require('../model/LotType');
const LotStatus = require('../model/LotStatus');
const LotImage = require('../model/LotImage');
const Logger = require('../model/Logger');
const validator  = require('validator');

const UtilsController = require('../controller/UtilsController');

module.exports.AddLot = async( req , res ) => {

    try{

        let categoriesIds = req.body.categories;

        if (categoriesIds&&categoriesIds.length===0) {
            return {
                code: 400,
                data: categoriesIds,
                message:  'Категории должны быть выбраны!'
            }
        }//if

        for(let i =0; i< categoriesIds.length; i++){

            let cat = Category.findById(categoriesIds[i]);

            if(!cat){
                return {
                    code: 400,
                    data: categoriesIds[i],
                    message:  'Такой категории не найденно!'
                }
            }//if

        }//for

        let lotTitle = req.body.lotTitle;
        let startPrice = +req.body.startPrice;
        // let customerLotID = req.body.customerID;
        // let customerLot = await User.findById(customerLotID);
        //
        // if(!customerLot){
        //     return {
        //         code: 400,
        //         data: customerLotID,
        //         message:  'покупатель не найден!'
        //     }
        // }//if

        let sellerLotID = req.body.sellerID;
        let sellerLot = await User.findById(sellerLotID);
        if(!sellerLot){
                return {
                    code: 400,
                    data: customerLotID,
                    message:  'Продавец  не найден!'
                }
            }//if

        let lotDescription = req.body.lotDescription;
        let lotImagePath = req.body.lotImagePath;

        if (lotImagePath&&lotImagePath.length===0) {
            return {
                code: 400,
                data: lotImagePath,
                message:  'Картинки должны быть добавлены'
            }
        }//if

        let mapLot = req.body.mapLot;

        if(!mapLot){
            return {
                code: 400,
                data: mapLot,
                message:  'Добавте координаты'
            }
        }//if
        let currentRate = req.body.currentRate;
        let dateAdminAnswer = req.body.dateAdminAnswer;
        let datePlacement = req.body.datePlacement;
        let dateStartTrade = req.body.dateStartTrade;
        let dateEndTrade = req.body.dateEndTrade;

        let typeLot = req.body.typeLot;

        let lotType =  await LotType.findById(typeLot);
        if ( !lotType){
            return {
                code: 400,
                data: typeLot,
                message:  'Тип лота не найден!'
            }
        }//if

        let statusLot = req.body.statusLot;

        let lotStatus =  await LotStatus.findById(statusLot);
        if ( !lotStatus){
            return {
                code: 400,
                data: typeLot,
                message:  'Стaтус лота не найден!'
            }
        }//if

        let coord = new CoordMap({
            "lat": +mapLot.lat,
            "lon": +mapLot.lon,
        });

        let newCoord = await coord.save();

        let newLot = null;

        try {

            newLot = new Lot({
                'lotTitle': lotTitle,
                //'customer': customerLot.id,
                'seller': sellerLot._id,
                'lotDescription': lotDescription,
                'startPrice': startPrice,
                'mapLot': newCoord._id,
                'currentRate': currentRate,
                'dateAdminAnswer': dateAdminAnswer,
                'datePlacement': datePlacement,
                'dateStartTrade': dateStartTrade,
                'dateEndTrade': dateEndTrade,
                'typeLot': lotType._id,
                'statusLot': lotStatus._id
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
        
        for(let i =0; i< categoriesIds.length; i++){

            let c = categoriesIds[i];
            Category.findByIdAndUpdate(c,
                { "$push": { "lots": newLot._id } }
            );

            newLot.categories.push( c );

        }//for

        for(let i =0; i< lotImagePath.length; i++){

            let path = new LotImage({
                'path':  lotImagePath[i]
            });

            let newImage = await path.save();

            newLot.lotImagePath.push(newImage._id);
        }//for

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

module.exports.GetLotList = async (req, res) => {

    let limit = req.query.limit || 10;
    let offset = req.query.offset || 0;


    let lots = await Lot.find()
        .limit(limit)
        .skip(offset)
        .populate('categories', 'lotImagePath');

    res.send( {
        statusCode: 200,
        data: lots,
        message: "show lots"
    });

};

module.exports.DeleteLot = async (req, res) => {

    try {

        let lotId = req.params.id;

        let deleteLot = Lot.findById(lotId);

        if(!deleteLot){
            return {
                code: 400,
                data: lotId,
                message:  'Лот не найден!'
            }
        }//if

        let result = await Lot.findOneAndDelete({_id: lotId});

        for(let i =0; i< result.lotImagePath.length; i++){

            await LotImage.findOneAndDelete({_id: result.lotImagePath[i]});
        }//for
        
        await CoordMap.findOneAndDelete({_id: result.mapLot});

        res.send( {
            statusCode: 200,
            data: result,
            message: "show lots"
        });

        

    }//try
    catch(ex){

        console.log(ex);
        res.send( {
            statusCode: 500,
            data: ex,
            message: "Server error"
        });
    }//catch

};