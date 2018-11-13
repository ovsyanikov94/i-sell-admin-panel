"use strict";

const Lot = require('../model/Lot');
const Category = require('../model/Category');
const User = require('../model/User');
const CoordMap = require('../model/CoordMap');
const LotType = require('../model/LotType');
const LotStatus = require('../model/LotStatus');
const LotImage = require('../model/LotImage');
const Logger = require('../model/Logger');
const ValidatorConstants = require('../model/Validation');
const fs = require('fs');

const Response = require('../model/Response');
const UtilsController = require('../controller/UtilsController');

module.exports.AddLot = async( req , res ) => {

    try{

        let categoriesIds = req.body.categories;

        if (categoriesIds&&categoriesIds.length===0) {
            Response.status = 400;
            Response.message = 'Категории должны быть выбраны!!';
            Response.data = categoriesIds;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if

        for(let i =0; i< categoriesIds.length; i++){

            let cat = await Category.findById(categoriesIds[i]);

            if(!cat){
                Response.status = 400;
                Response.message = 'Такой категории не найденно!';
                Response.data = categoriesIds[i];

                res.status(Response.status);
                res.send(Response);

                return;

            }//if

        }//for

        let lotTitle = req.body.lotTitle;

        if( !lotTitle.match( ValidatorConstants.TITLE_VALIDATOR ) ){

            Response.status = 400;
            Response.message = 'Название лота не верно!';
            Response.data = lotTitle;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if

        let startPrice = +req.body.startPrice;

        if( startPrice < ValidatorConstants.LOT_START_PRICE  ){

            Response.status = 400;
            Response.message = 'Стартовая цена указана неверно!';
            Response.data = startPrice;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if
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
            Response.status = 400;
            Response.message = 'Продавец  не найден!';
            Response.data = sellerLotID;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let lotDescription = req.body.lotDescription;

        if( !lotDescription.match( ValidatorConstants.LOT_DESCRIPTION_VALIDATOR ) ){

            Response.status = 400;
            Response.message = 'Описание лота не верно!';
            Response.data = lotDescription;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if


        let mapLot = req.body.mapLot;

        if(!mapLot){
            Response.status = 400;
            Response.message = 'Добавте координаты';
            Response.data = mapLot;

            res.status(Response.status);
            res.send(Response);

            return ;
        }//if
        let currentRate = req.body.currentRate;

        if( currentRate < ValidatorConstants.LOT_RATE  ){

            Response.status = 400;
            Response.message = 'рейтинг некорректен!';
            Response.data = startPrice;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if

        let dateAdminAnswer = req.body.dateAdminAnswer;

        let datePlacement = req.body.datePlacement;

        let dateStartTrade = req.body.dateStartTrade;
        let dateEndTrade = req.body.dateEndTrade;

        let typeLot = req.body.typeLot;

        let lotType =  await LotType.findById(typeLot);
        if ( !lotType){
            Response.status = 400;
            Response.message = 'Тип лота не найден!';
            Response.data = typeLot;

            res.status(Response.status);
            res.send(Response);

            return ;
        }//if

        let statusLot = req.body.statusLot;

        let lotStatus =  await LotStatus.findById(statusLot);
        if ( !lotStatus){

            Response.status = 400;
            Response.message = 'Стaтус лота не найден!';
            Response.data = lotStatus;

            res.status(Response.status);
            res.send(Response);

            return ;
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

            Response.status = 400;
            Response.message = message;

            res.status(Response.status);
            res.send(Response);

            return ;

        }//catch
        
        for(let i =0; i< categoriesIds.length; i++){

            let c = categoriesIds[i];

            let newCategory = await Category.findById(c);
            newCategory.lots.push(newLot._id);
            await newCategory.save();

            newLot.categories.push( c );

        }//for

        if(req.files){

            let lotImages = req.files.image;
            let path = `public/images/lots/${newLot._id}`;


            if(!fs.existsSync('public/images')){
                fs.mkdirSync('public/images');
            }//if

            if(!fs.existsSync('public/images/lots')){
                fs.mkdirSync('public/images/lots');
            }//if

            try{
                fs.mkdirSync(path);
            }//catch
            catch(ex){
                console.log(ex)
            }//try

            for (let i=0; i<lotImages.length; i++){

                let lotImage = lotImages[i];

                lotImage.mv( `${path}/${lotImage.name}`,async function(err){

                    if (err){
                        console.log('FILE UPLOAD ERROR:' , err);
                        return;
                    }//if

                    let pathLot = `images/lots/${newLot._id}/${lotImage.name}`;

                    let path = new LotImage({
                        'path':  pathLot
                    });

                    let newImage = await path.save();

                    newLot.lotImagePath.push(newImage._id);

                })//lotImage.mv
            } //for

        }//if req.files


        let createLotResult = await newLot.save();

        Response.status = 200;
        Response.message = 'Лот добавлен';
        Response.data = newLot;


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

module.exports.GetLotList = async (req, res) => {

    try{
        let limit = req.query.limit || 10;
        let offset = req.query.offset || 0;


        let lots = await Lot.find()
            .limit(limit)
            .skip(offset)
            .populate('categories', 'lotImagePath');

        Response.status = 200;
        Response.message = 'Смотрите ЛОТЫ!!!!';
        Response.data = lots;


    }//try
    catch(ex){

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

        for(let i =0; i< result.categories.length; i++){

            let c = result.categories[i];

            let category = await Category.findById(c);

            let index = category.lots.indexOf(result._id);
            category.lots.splice(index, 1);

            await category.save();

        }//for

        res.send( {
            statusCode: 200,
            data: result,
            message: "Лот удален"
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