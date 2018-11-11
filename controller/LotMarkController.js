"use strict";

const LotMark = require('../model/LotMark');
const User = require('../model/User');
const Lot = require('../model/Lot');

const Logger = require('../model/Logger');
const UtilsController = require('../controller/UtilsController');

const LotMarkConstants = require('../model/LotMarkConstants');

module.exports.AddLotMark = async( req, res ) =>{

    try{

        //получаем айди отправителя, получателя и оценку лота
        let senderID = req.body.senderID;
        let receiverID = req.body.recieverID;
        let mark = req.body.mark;

        //получаем объекты пользователя и лота которым была поставлена оценка
        let user = await User.findById(senderID);
        let lot = await Lot.findById(receiverID);

        if(!user){

            res.status(400);
            res.send({
               code: 400,
               message: 'Пользователь не найден!'
            });

        }//if
        if(!lot){
            
            res.status(400);
            res.send({
                code: 400,
                message: 'Лот не найден!'
            });
            
        }//if

        let newLotMark = null;
        
        try{

            //создаём объект и присваиваем значения полям
            newLotMark = new LotMark({

               sender: user,
               receiver: lot,
               mark: mark

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

        //сохраняем документ в коллекцию базы данных
        let createLotMarkResult = await newLotMark.save();

        res.status(200);
        res.send({
           code: 200,
           data: createLotMarkResult,
           message: 'Новая оценка добавлена'
        });

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

        res.status(500);

        res.send( {
            code: 500,
            message: "Внутренняя ошибка сервера!",
            data: ex
        } );

    }//catch

};//AddLotMark

module.exports.UpdateLotMark = async ( req, res ) => {

    try{

        //получаем айди оценки лота
        let lotMarkID = req.params.id;
        let mark = req.params.mark;

        let lotMarkToUpdate = await LotMark.findById(lotMarkID);

        if(lotMarkToUpdate.mark !== mark){

           let updateResult = await LotMark.findByIdAndUpdate(lotMarkID, { mark: mark });

            res.status(200);
            res.send({
                code: 200,
                data: updateResult,
                message:  'Оценка успешно изменена'
            });

        }//if

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

        res.status(500);

        res.send( {
            code: 500,
            message: "Внутренняя ошибка сервера!",
            data: ex
        } );

    }//catch


};//UpdateLotMark

module.exports.RemoveLotMark = async( req, res ) => {

    try{

        //достаём айди оценки определённого пользователя на определённом лоте
        let lotMarkID = req.params.id;

        let removedMark = null;

        if(lotMarkID){

            removedMark = await LotMark.findByIdAndRemove(lotMarkID);

            res.status(200);
            res.send({
                code: 200,
                data: removedMark,
                message: 'Оценка удалена'
            });

        }//if

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

        res.status(500);

        res.send( {
            code: 500,
            message: "Внутренняя ошибка сервера!",
            data: ex
        } );

    }//catch

};//RemoveLotMark

module.exports.GetLotMarkList = async ( req, res ) => {

    try{

        let limit = req.query.limit || LotMarkConstants.LOT_LIST_LIMIT;
        let offset = req.query.offset || LotMarkConstants.LOT_LIST_OFFSET;

        let lotMarks = await LotMark.find()
            .limit(limit)
            .skip(offset)
            .populate('sender');

        res.send( {
            statusCode: 200,
            data: lotMarks,
            message: "Список лотов"
        });

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

        res.status(500);

        res.send( {
            code: 500,
            message: "Внутренняя ошибка сервера!",
            data: ex
        } );

    }//catch

};//GetLotMarkList
