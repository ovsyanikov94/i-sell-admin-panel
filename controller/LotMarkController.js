"use strict";

const LotMark = require('../model/LotMark');
const User = require('../model/User');
const Lot = require('../model/Lot');

const Logger = require('../model/Logger');
const Response = require('../model/Response');
const UtilsController = require('../controller/UtilsController');

const LotMarkConstants = require('../model/LotMarkConstants');

module.exports.UpdateLotMark = async ( req, res ) => {

    try{

        //получаем айди оценки лота

        let userID = req.session.passport.user;

        let userCheck = await User.findById(userID , '_id');

        if(!userCheck){

            Response.status = 404;
            Response.message = 'Пользователь не найден!';
            Response.data = userID;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if

        let lotID = req.body.lotID;

        let lotCheck = await Lot.findById(lotID , '_id');

        if(!lotCheck){

            Response.status = 404;
            Response.message = 'Лот не найден!';
            Response.data = lotID;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if

        let mark = req.body.mark;

        let lotMarkToUpdate = await LotMark.findOne({
            receiver: lotID,
            sender: userID
        });

        let newLotMark = null;
        let updateResult = null;
        let removedMark = null;

        if( !lotMarkToUpdate ){

            newLotMark = new LotMark({

                sender: userID,
                receiver: lotID,
                mark: mark

            });

            await newLotMark.save();

        }//if
        else if(lotMarkToUpdate.mark !== mark){

           updateResult = await LotMark.findByIdAndUpdate(lotMarkToUpdate._id, { mark: mark });

        }//if
        else{
            removedMark = await LotMark.findByIdAndRemove(lotMarkToUpdate._id);
        }//else

        Response.status = 200;
        Response.message = 'Оценка успешно изменена';

        if( newLotMark !== null ){
            Response.data = newLotMark;
        }//if
        else if(updateResult !== null){
            Response.data = updateResult;
        }//else
        else{
            Response.data = removedMark;
        }//else

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

    }//catch


    res.status(Response.status);
    res.send(Response);

};//UpdateLotMark

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

    }//catch

    res.status(Response.status);
    res.send(Response);

};//GetLotMarkList
