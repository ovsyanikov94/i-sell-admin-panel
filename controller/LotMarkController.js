"use strict";

const LotMark = require('../model/LotMark');
const User = require('../model/User');
const Lot = require('../model/Lot');

const Logger = require('../model/Logger');
const Response = require('../model/Response');
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

            Response.status(400);
            Response.message = 'Пользователь не найден!';
            Response.data = user;

            res.status(Response.status);
            res.send(Response);

        }//if
        if(!lot){

            Response.status(400);
            Response.message = 'Лот не найден!';
            Response.data = lot;

            res.status(Response.status);
            res.send(Response);
            
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

            Response.status = 400;
            Response.message = message;

            res.status(Response.status);
            res.send(Response);

            return;

        }//catch

        //сохраняем документ в коллекцию базы данных
        let createLotMarkResult = await newLotMark.save();

        Response.status = 200;
        Response.message = 'Новая оценка добавлена';
        Response.data = createLotMarkResult;

        res.status(Response.status);
        res.send(Response);

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
        Response.data = ex;

        res.status(Response.status);
        res.send(Response);

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

            Response.status = 200;
            Response.message = 'Оценка успешно изменена';
            Response.data = updateResult;

            res.status(Response.status);
            res.send(Response);

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

        Response.status = 500;
        Response.message = 'Внутренняя ошибка сервера!';
        Response.data = ex;

        res.status(Response.status);
        res.send(Response);

    }//catch


};//UpdateLotMark

module.exports.RemoveLotMark = async( req, res ) => {

    try{

        //достаём айди оценки определённого пользователя на определённом лоте
        let lotMarkID = req.params.id;

        let removedMark = null;

        if(lotMarkID){

            removedMark = await LotMark.findByIdAndRemove(lotMarkID);

            Response.status = 200;
            Response.message = 'Оценка удалена';
            Response.data = removedMark;

            res.status(Response.status);
            res.send(Response);

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

        Response.status = 500;
        Response.message = 'Внутренняя ошибка сервера!';
        Response.data = ex;

        res.status(Response.status);
        res.send(Response);

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

        Response.status = 200;
        Response.message = 'Список лотов';
        Response.data = lotMarks;

        res.status(Response.status);
        res.send(Response);

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
        Response.data = ex;

        res.status(Response.status);
        res.send(Response);

    }//catch

};//GetLotMarkList
