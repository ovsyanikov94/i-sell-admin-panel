"use strict";

const LotMark = require('../../model/LotMark');
const User = require('../../model/User');
const Lot = require('../../model/Lot');

const Logger = require('../../model/Logger');
const Response = require('../../model/Response');
const UtilsController = require('../UtilsController');

const LotMarkConstants = require('../../model/LotMarkConstants');

module.exports.UpdateLotMark = async ( req, res ) => {

    try{

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

        let lotID = req.body.receiver;

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

        let like = null;
        let dislike = null;

        //если оценки в базе нет - значит это новая оценка
        if( !lotMarkToUpdate ){

            newLotMark = new LotMark({

                sender: userID,
                receiver: lotID,
                mark: mark

            });

            await newLotMark.save();

            if(mark === LotMarkConstants.LOT_MARK_DISLIKE){
                dislike = 1;
                like = 0;
            }//if
            else{
                dislike = 0;
                like = 1;
            }//else

        }//if
        else if(lotMarkToUpdate.mark !== mark){

           updateResult = await LotMark.findByIdAndUpdate(lotMarkToUpdate._id, { mark: mark });

           if(mark === LotMarkConstants.LOT_MARK_DISLIKE){
               like = -1;
               dislike = 1;
           }//if
           else{
               dislike = -1;
               like = 1;
           }//else

        }//if
        else{
            removedMark = await LotMark.findByIdAndRemove(lotMarkToUpdate._id);

            if(mark === LotMarkConstants.LOT_MARK_DISLIKE){
                dislike = -1;
                like = 0;
            }//if
            else{
                dislike = 0;
                like = -1;
            }//else

        }//else

        Response.status = 200;
        Response.message = 'Оценка успешно изменена';

        if( newLotMark !== null ){
            Response.data = {
                newLotMark: newLotMark,
                like: like,
                dislike: dislike
            };
        }//if
        else if(updateResult !== null){
            Response.data = {
                newLotMark: updateResult,
                like: like,
                dislike: dislike
            }
        }//else
        else{
            Response.data = {
                newLotMark: removedMark,
                like: like,
                dislike: dislike
            }
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

module.exports.GetUsersListWithMarks = async ( req, res ) => {

    try{
        let limit = req.query.limit || LotMarkConstants.LOT_LIST_LIMIT;
        let offset = req.query.offset || LotMarkConstants.LOT_LIST_OFFSET;

        let lotID = req.query.receiver;

        let lotCheck = await Lot.findById(lotID);

        if(!lotCheck){

            Response.status = 404;
            Response.message = 'Лот не найден!';
            Response.data = lotID;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if

        let mark = req.body.mark;

        let usersWithMark = await LotMark.find().where({mark: mark})
            .limit(limit)
            .skip(offset);

        Response.status = 200;
        Response.message = 'Пользователи с оценками найдены!';
        Response.data = usersWithMark;

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

    }//catch

    res.status(Response.status);
    res.send(Response);

}//GetUsersListWithMarks

module.exports.GetCurrentLikeDislikeLotInfo = async (req, res) =>{

    let lotId = req.query.receiver;
    let userId = req.session.passport.user;

    try{
        let markedLot = await LotMark.findOne({sender: userId, receiver: lotId});

        if(!markedLot){
            Response.status = 200;
            Response.message = 'Лот с оценкой пользователя не найден!';
            Response.data = -1;
        }//if
        else{
            Response.status = 200;
            Response.message = 'Лот с оценкой пользователя найден!';
            Response.data = markedLot.mark;
        }//else

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
    }//catch

}//GetCurrentLikeDislikeLotInfo
