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

const LotTypeEnum = require('../model/Enums/LotType');
const LotStatusEnum = require('../model/Enums/LotStatus');

const moment = require('moment');

const Response = require('../model/Response');
const UtilsController = require('../controller/UtilsController');

module.exports.AddLot = async( req , res ) => {


    try{

        if(!req.files){
            Response.status = 400;
            Response.message = 'Изображения не добавлены!!';
            Response.data = null;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if


        let categoriesIds = JSON.parse(req.body.categories);

        if (!categoriesIds || categoriesIds.length===0) {
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


        let sellerLotID = req.session.passport.user;

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

        if( !lotDescription.match( ValidatorConstants.TEXT_VALIDATOR ) ){

            Response.status = 400;
            Response.message = 'Описание лота не верно!';
            Response.data = lotDescription;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if

        let mapLot = JSON.parse(req.body.mapLot);

        if(!mapLot){
            Response.status = 400;
            Response.message = 'Добавте координаты';
            Response.data = mapLot;

            res.status(Response.status);
            res.send(Response);

            return ;
        }//if

        if(mapLot.lat < 0 || mapLot.lon < 0){
            Response.status = 400;
            Response.message = 'Значение коррдинат не может быть меньше 0';
            Response.data = mapLot;

            res.status(Response.status);
            res.send(Response);

            return ;

        }//if

        let currentRate = startPrice;

        let datePlacement = moment(new Date()).unix();

        let dateStartTrade = null;
        let dateEndTrade = null;

        let countHourTrade = +req.body.countHourTrade;

        if(countHourTrade < ValidatorConstants.LOT_COUNTHOUR_MIN_VALIDATOR || countHourTrade > ValidatorConstants.LOT_COUNTHOUR_MAX_VALIDATOR){
            Response.status = 400;
            Response.message = 'Длительность торгов указана неверно';
            Response.data = countHourTrade;

            res.status(Response.status);
            res.send(Response);

            return ;
        }
        let typeLotId = +req.body.typeLot;

        let lotType =  await LotType.findOne({typeID: typeLotId });

        if ( !lotType){

            Response.status = 400;
            Response.message = 'Тип лота не найден!';
            Response.data = lotType;

            res.status(Response.status);
            res.send(Response);

            return ;
        }//if



        if(typeLotId===LotTypeEnum.PLANED){//запланированный

            dateStartTrade = req.body.dateStartTrade;

            if(dateStartTrade < ValidatorConstants.LOT_DATE_VALIDATOR || moment.unix(dateStartTrade).isValid()===false){
                Response.status = 400;
                Response.message = 'Дата старта указана неверно';
                Response.data = dateStartTrade;

                res.status(Response.status);
                res.send(Response);

                return ;
            }//if


            let newDate = moment.unix(dateStartTrade).add(countHourTrade, 'h');
            dateEndTrade = moment(newDate).unix();
        }//if

        let statusLotId = LotStatusEnum.IN_PROCESS;

        let coord = new CoordMap({
            "lat": +mapLot.lat,
            "lon": +mapLot.lon,
        });

        let newCoord = await coord.save();

        let newLot = null;

        try {

            newLot = new Lot({
                'lotTitle': lotTitle,
                'seller': sellerLot._id,
                'lotDescription': lotDescription,
                'startPrice': startPrice,
                'mapLot': newCoord._id,
                'currentRate': currentRate,
                'datePlacement': datePlacement,
                'dateStartTrade': dateStartTrade,
                'dateEndTrade': dateEndTrade,
                'typeLot': typeLotId,
                'statusLot': statusLotId,
                'countHourTrade': countHourTrade
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

        let newTypeLot = await LotType.findById(lotType._id);
            newTypeLot.lots.push(newLot._id);
        await newTypeLot.save();

        for(let i =0; i< categoriesIds.length; i++){

            let c = categoriesIds[i];

            let newCategory = await Category.findById(c);
            newCategory.lots.push(newLot._id);
            await newCategory.save();

            newLot.categories.push( c );

        }//for


        let createLotResult = await newLot.save();

        console.log('req.files', req.files);

        if(req.files){

            let lotImages = req.files.images;
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

            console.log('lotImages.length',lotImages.length);

            if(lotImages.length === undefined){
                let lotImage = lotImages;

                lotImage.mv( `${path}/${lotImage.name}`, async function(err){

                    if (err){
                        console.log('FILE UPLOAD ERROR:' , err);
                        return;
                    }//if

                    let pathLot = `/i-sell-admin-api/images/lots/${newLot._id}/${lotImage.name}`;

                    let path = new LotImage({
                        'path':  pathLot
                    });

                    let newImage = await path.save();


                    let addLot = await Lot.findById(newLot._id);
                    addLot.lotImagePath.push(newImage._id);
                    await addLot.save();

                })//lotImage.mv
            }//if

            for (let i=0; i<lotImages.length; i++){

                let lotImage = lotImages[i];

                lotImage.mv( `${path}/${lotImage.name}`, async function(err){

                    if (err){
                        console.log('FILE UPLOAD ERROR:' , err);
                        return;
                    }//if

                    let pathLot = `/i-sell-admin-api/images/lots/${newLot._id}/${lotImage.name}`;

                    let path = new LotImage({
                        'path':  pathLot
                    });

                    let newImage = await path.save();

                    let addLot = await Lot.findById(newLot._id);
                    addLot.lotImagePath.push(newImage._id);
                    await addLot.save();



                })//lotImage.mv
            } //for

        }//if req.files

        sellerLot.lots.push(newLot._id);
        await sellerLot.save();

        Response.status = 200;
        Response.message = 'Лот добавлен';
        Response.data = newLot;


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
        Response.message = ex.message;
        Response.data = ex.message;



    }//catch

    res.status(Response.status);
    res.send(Response);

};

module.exports.GetLotListActive = async (req, res) => {

    try{
        let limit = +req.query.limit || 10;
        let offset = +req.query.offset || 0;

        let lots = await Lot.find({statusLot: LotStatusEnum.ACTIVE})
            .limit(limit)
            .skip(offset)
            .populate('lotImagePath')
            .populate('mapLot')
            .populate('seller', 'userLogin')
            .populate('categories', 'title');



        for(let i =0; i< lots.length; i++){
        
            let countLikes = await lots[i].getLikes();
            let countDislikes = await lots[i].getDisLike();

        }//for

        Response.status = 200;
        Response.message = 'Смотрите ЛОТЫ!!!!';
        Response.data = lots;


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

        if(deleteLot.statusLot === LotStatusEnum.ACTIVE){

            Response.status = 400;
            Response.message = 'Лот активный удалить невозможно';
            Response.data = deleteLot;

            res.status(Response.status);
            res.send(Response);

            return ;
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

        Response.status = 200;
        Response.message = 'Лот удален';
        Response.data = deleteLot;

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


module.exports.UpdateLot = async( req , res ) => {

    try{

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

        if ( lotStatus != 2){

            Response.status = 400;
            Response.message = 'Вы не можете вносить изменения в данный лот!';
            Response.data = lotStatus;

            res.status(Response.status);
            res.send(Response);

            return ;
        }//if

        let lotID = req.params.id;

        let lot = await Lot.findById(lotID);

        if(!lot){
            Response.status = 400;
            Response.message = 'Такой лот не найден!';
            Response.data = lot;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        lot.categories.length = 0;

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
            lot.categories.push( cat );
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

        if( startPrice < 0  ){

            Response.status = 400;
            Response.message = 'Стартовая цена не может быть меньше 0!';
            Response.data = startPrice;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if


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

        if( !lotDescription.match( ValidatorConstants.TEXT_VALIDATOR ) ){

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
            Response.message = 'Добавьте координаты';
            Response.data = mapLot;

            res.status(Response.status);
            res.send(Response);

            return ;
        }//if

        if(mapLot.lat<0 || mapLot.lon<0){
            Response.status = 400;
            Response.message = 'Значение коррдинат не может быть меньше 0';
            Response.data = mapLot;

            res.status(Response.status);
            res.send(Response);

            return ;
        }//if

        let currentRate = startPrice;


        //let dateAdminAnswer = req.body.dateAdminAnswer;

        let datePlacement = req.body.datePlacement;

        if (!datePlacement){
            Response.status = 400;
            Response.message = 'Дата размещения лота некорректна!';
            Response.data = dateStartTrade;

            res.status(Response.status);
            res.send(Response);

            return ;
        }//if

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

        let dateStartTrade = req.body.dateStartTrade;

        if ( lotType!=1 && dateStartTrade){
            Response.status = 400;
            Response.message = 'При немедленном типе лота дату начала торгов назначает администратор!';
            Response.data = typeLot;

            res.status(Response.status);
            res.send(Response);

            return ;
        }//if

        if (!dateStartTrade){
            Response.status = 400;
            Response.message = 'Укажите дату начала торгов!';
            Response.data = dateStartTrade;

            res.status(Response.status);
            res.send(Response);

            return ;
        }//if
        if (dateStartTrade<datePlacement){
            Response.status = 400;
            Response.message = 'Дата начала торгов не может быть раньше даты размещения лота!';
            Response.data = dateStartTrade;

            res.status(Response.status);
            res.send(Response);

            return ;
        }//if



        //let dateEndTrade = req.body.dateEndTrade;

        let newCoord = await CoordMap.findById(mapLot._id);
        await newCoord.update({lat: mapLot.lat} , {lon:mapLot.lon}).fetch();




        let appCategories = await Category.find();

        for(let i =0; i< appCategories.length; i++){


            for(let j =0; j< categoriesIds.length; j++){

                let indexLot = appCategories[i].lots.indexOf(lot);
                if(appCategories[i]._id != categoriesIds[j]._id && indexLot!=-1 && categoriesIds[j].lots.indexOf(lot)==-1){
                    appCategories[i].lots.splice(indexLot,1);
                }//if
                if(categoriesIds[j].lots.indexOf(lot) === -1){
                    categoriesIds[j].lots.push(lot);
                }//if


            }//for

        }//for



        if(req.files){

            let lotImages = req.files.images;
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

            console.log('lotImages.length', lotImages.length);
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


        let updateLot = await lot.update({categories: lot.categories} ,
            {lotTitle:lotTitle},
            {startPrice:startPrice},
            {seller:sellerLotID},
            {lotDescription:lotDescription},
            {mapLot:mapLot},
            {dateStartTrade:dateStartTrade},
        ).fetch();

        res.status(200);
        res.send({
            code: 200,
            data: updateLot,
            message:  'Изменение лота успешно!'
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

module.exports.GetLotById= async (req, res) => {

    try{
        let idLot = req.query.id ;

        let lot = await Lot.findOne({_id: idLot})
            .populate('lotImagePath')
            .populate('mapLot')
            .populate('seller', 'userLogin')
            .populate('categories', 'title')
            .populate('comments');

        let countLikes = await lot.getLikes();
        let countDislikes = await lot.getDisLike();

        Response.status = 200;
        Response.message = 'Смотрите ЛОТЫ!!!!';
        Response.data = lot;


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


//ADMIN PANEL
module.exports.GetLotListInProcess = async (req, res) => {

    try{

        let lots = await Lot.find({statusLot: LotStatusEnum.IN_PROCESS})
            .populate('lotImagePath')
            .populate('mapLot')
            .populate('seller', 'userLogin')
            .populate('categories', 'title');


        Response.status = 200;
        Response.message = 'Смотрите ЛОТЫ!!!!';
        Response.data = lots;


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