"use strict";

const Lot = require('../model/Lot');
const User = require('../model/User');
const Comment = require('../model/Comment');
const Logger = require('../model/Logger');

const CommentType = require('../model/CommentType');
const CommentStatus = require('../model/CommentStatus');
const CommentTypeEnum = require('../model/Enums/CommentType');
const ValidatorConstants = require('../model/Validation');
const Response = require('../model/Response');

const moment = require('moment');
const validator = require('validator');

module.exports.AddComment = async( req , res ) => {


    try{

        let commentText = req.body.commentText && req.body.commentText.trim();

        if(!commentText || commentText.length < ValidatorConstants.COMMENT_MIN_LENGTH || commentText.length > ValidatorConstants.COMMENT_MAX_LENGTH){

            Response.status = 400;
            Response.message = 'Несоответствующая длина комментария !';
            Response.data = commentText;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let commentStatusID = req.body.commentStatusID;

        let commentStatus =  await CommentStatus.find({commentStatusID: commentStatusID });

        if ( commentStatus.length === 0){

            Response.status = 400;
            Response.message = 'Статус комментария не найден!';
            Response.data = commentStatus;

            res.status(Response.status);
            res.send(Response);

            return ;
        }//if

        let commentTypeID = req.body.commentTypeID;

        let commentType =  await CommentType.find({commentTypeID: commentTypeID });

        if ( commentType.length === 0){

            Response.status = 400;
            Response.message = 'Тип комментария не найден!';
            Response.data = commentType;

            res.status(Response.status);
            res.send(Response);

            return ;
        }//if

        let commentSendDate = req.body.commentSendDate;

        if( commentSendDate < ValidatorConstants.COMMENT_DATE_VALIDATOR || moment.unix(commentSendDate).isValid()===false ){

            Response.status = 400;
            Response.message = 'Неверный формат даты !';
            Response.data = commentSendDate;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let userSenderID = req.body.userSenderID;

        let userSender =  await User.find({_id: userSenderID });

        if ( userSender.length === 0){

            Response.status = 400;
            Response.message = 'Отправитель не найден!';
            Response.data = userSender;

            res.status(Response.status);
            res.send(Response);

            return ;

        }//if

        let newComment = null;

        try {

            newComment = new Comment({

                commentText: commentText,
                commentStatus: commentStatusID,
                commentType: commentTypeID,
                commentSendDate: commentSendDate,
                userSender: userSenderID

            });

        }//try
        catch(ex){

            Response.status = 400;
            Response.message = 'Ошибка при создании комментария!';
            Response.data = newComment;

            res.status(Response.status);
            res.send(Response);

            return;


        }//catch

        if (+commentTypeID === CommentTypeEnum.LOT){

            try{

                let lotID = req.body.lotID;

                if(!validator.isMongoId(lotID)){

                    Response.status = 400;
                    Response.message = 'Неверный ID лота !';
                    Response.data = lotID;

                    res.status(Response.status);
                    res.send(Response);

                    return;

                }//if

                let lot = await Lot.findById( lotID , '_id');

                newComment.lot = lot._id;

            }//try
            catch(ex){

                Response.status = 400;
                Response.message = 'Ошибка при добавлении лота к комментарию!';
                Response.data = ex;

                console.log(ex);

                res.status(Response.status);
                res.send(Response);

                return;

            }//catch


        }//else

        else if(+commentTypeID === CommentTypeEnum.PERSONAL ){

            try{

                let userReceiverID = req.body.userReceiverID;

                if(!validator.isMongoId(userReceiverID)){

                    Response.status = 400;
                    Response.message = 'Неверный ID получателя !';
                    Response.data = userReceiverID;

                    res.status(Response.status);
                    res.send(Response);

                    return;

                }//if

                let user = await User.findById(userReceiverID , '_id');

                newComment.userReceiver = user._id;

            }//try
            catch(ex){

                Response.status = 400;
                Response.message = 'Ошибка при добавлении получателя!';
                Response.data = ex;

                console.log(ex);

                res.status(Response.status);
                res.send(Response);

                return;

            }//catch

        }//if

        let createResult = await newComment.save();

        Response.status = 200;
        Response.message = 'Комментарий успешно добавлен!';
        Response.data = createResult;


    }//try
    catch(ex){

        Response.status = 500;
        Response.message = 'Ошибка сервера!';
        Response.data = ex;

        console.log(ex);

        Logger.error({
            time: new Date().toISOString(),
            status: 500,
            data: {
                message: ex.message,
                stack: ex.stack
            },
        });

    }//catch

    res.status(Response.status);
    res.send(Response);

};

module.exports.UpdateComment = async( req , res ) => {

    try{

        let commentID = req.params.id || '';

        let comment = Lot.findById(commentID);

        if(!comment){
            return {
                code: 400,
                data: commentID,
                message:  'Комментарий не был найден!'
            }
        }//if

        let commentText = req.body.commentText && req.body.commentText.trim();

        if(!commentText || commentText.length < ValidatorConstants.COMMENT_MIN_LENGTH || commentText.length > ValidatorConstants.COMMENT_MAX_LENGTH){

            Response.status = 400;
            Response.message = 'Некорректная длина комментария!';
            Response.data = commentText;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let updateComment = null;

        try {

            updateComment = await Comment.where({_id: commentID}).update({commentText:commentText});

        }//try
        catch(ex){

            Response.status = 400;
            Response.message = 'Комментарий не был обновлен!';
            Response.data = updateComment;

            res.status(Response.status);
            res.send(Response);

            return;

        }//catch

        Response.status = 200;
        Response.message = 'Комментарий успешно обновлен!';
        Response.data = updateComment;

    }//try
    catch(ex){

        Response.status = 500;
        Response.message = 'Ошибка сервера!';
        Response.data = ex;

        console.log(ex);

        Logger.error({
            time: new Date().toISOString(),
            status: 500,
            data: {
                message: ex.message,
                stack: ex.stack
            },
        });

    }//catch

    res.status(Response.status);
    res.send(Response);

};

module.exports.DeleteComment = async( req , res ) => {

    try{

        let commentID = req.params.id;

        let deleteComment = Lot.findById(commentID);

        if(!deleteComment){
            return {
                code: 400,
                data: commentID,
                message:  'Комментарий не был найден!'
            }
        }//if

        let result = await Comment.findOneAndDelete({_id: commentID});

        Response.status = 200;
        Response.message = 'Комментарий успещно удален!';
        Response.data = result;


    }//try
    catch(ex){

        Response.status = 500;
        Response.message = 'Ошибка сервера!';
        Response.data = ex;

        console.log(ex);

        Logger.error({
            time: new Date().toISOString(),
            status: 500,
            data: {
                message: ex.message,
                stack: ex.stack
            },
        });

    }//catch

    res.status(Response.status);
    res.send(Response);

};

module.exports.GetComments = async( req , res ) => {

    try{

        let comments = await Comment.find({commentType: CommentTypeEnum.LOT }, 'id commentStatus commentType commentSendDate userSender userReceiver lot ',{
            limit: +req.query.limit || ValidatorConstants.COMMENT_DEFAULT_LIMIT,
            skip: +req.query.offset || ValidatorConstants.COMMENT_DEFAULT_SKIP
        });

        Response.status = 200;
        Response.message = 'Список комментариев: ';
        Response.data = comments;


    }//try
    catch(ex){

        Response.status = 500;
        Response.message = 'Ошибка сервера!';
        Response.data = ex;

        console.log(ex);

        Logger.error({
            time: new Date().toISOString(),
            status: 500,
            data: {
                message: ex.message,
                stack: ex.stack
            },
        });

    }//catch

    res.status(Response.status);
    res.send(Response);


};