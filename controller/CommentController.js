"use strict";

const Lot = require('../model/Lot');
const User = require('../model/User')
const Logger = require('../model/Logger');

const CommentTypeEnum = require('../model/Enums/CommentType');
const ValidatorConstants = require('../model/Validation');
const Response = require('../model/Response');

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

        if( !commentStatusID.match( ValidatorConstants.COMMENT_STATUS_ID ) ){

            Response.status = 400;
            Response.message = 'Неправильный id статуса комментария !';
            Response.data = commentStatusID;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let commentTypeID = req.body.commentTypeID;

        if( !commentTypeID.match( ValidatorConstants.COMMENT_TYPE_ID ) ){

            Response.status = 400;
            Response.message = 'Неправильный id типа комментария!';
            Response.data = commentTypeID;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if

        //!!!!!!!!!! UNIX !!!!!!!!!!!
        let commentSendDate = req.body.commentSendDate;

        if( !commentSendDate.match( ValidatorConstants.COMMENT_DATE_VALIDATOR ) ){

            Response.status = 400;
            Response.message = 'Неверный формат даты !';
            Response.data = commentSendDate;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let userSenderID = req.body.userSender;

        if(!validator.isMongoId(userSenderID)){

            Response.status = 400;
            Response.message = 'Неверный ID оправителя !';
            Response.data = userSenderID;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let newComment = null;

        try {

            newComment = new Comment({

                commentText: commentText,
                commentStatusID: commentStatusID,
                commentTypeID: commentTypeID,
                commentSendDate: commentSendDate

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

        if(commentTypeID === CommentTypeEnum.PERSONAL ){

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

                await newComment.addFields({userReceiver:userReceiverID});

            }//try
            catch(ex){

                Response.status = 400;
                Response.message = 'Ошибка при добавлении получателя!';
                Response.data = ex;

                res.status(Response.status);
                res.send(Response);

                return;

            }//catch

        }//if

        else if (commentTypeID === CommentTypeEnum.LOT){

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

                await newComment.addFields({lot:lotID});

            }//try
            catch(ex){

                Response.status = 400;
                Response.message = 'Ошибка при добавлении лота к комментарию!';
                Response.data = ex;

                res.status(Response.status);
                res.send(Response);

                return;

            }//catch

            newComment.addFields({

            });

        }//else

        let createResult = await newComment.save();

        Response.status = 200;
        Response.message = 'Комментарий успещно добавлен!';
        Response.data = createResult;



    }//try
    catch(ex){

        Response.status = 500;
        Response.message = 'Ошибка сервера!';
        Response.data = ex;

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

        let commentID = req.body.id || '';

        if(!await Comment.findOne({id: commentID})){

            Response.status = 400;
            Response.message = 'Комментарий с таким ID не был найден!';
            Response.data = commentID;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let commentText = req.body.commentText && req.body.commentText.trim();

        if(commentText || commentText.length < ValidatorConstants.COMMENT_MIN_LENGTH || commentText.length > ValidatorConstants.COMMENT_MAX_LENGTH){

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

        let updateResult = await updateComment.save();

        Response.status = 200;
        Response.message = 'Комментарий успещно обновлен!';
        Response.data = updateResult;

    }//try
    catch(ex){

        Response.status = 500;
        Response.message = 'Ошибка сервера!';
        Response.data = ex;

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

        let commentID = req.body.commentID;

        if(!await Comment.findOne({id: commentID})){

            Response.status = 400;
            Response.message = 'Комментарий с таким ID не был найден!';
            Response.data = commentID;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let deleteComment = null;

        try {

            deleteComment = await Comment.remove({_id:commentID});

        }//try
        catch(ex){

            Response.status = 400;
            Response.message = 'Комментарий не был удален!';
            Response.data = deleteComment;

            res.status(Response.status);
            res.send(Response);

            return;

        }//catch

        let deleteResult = await deleteComment.save();

        Response.status = 200;
        Response.message = 'Комментарий успещно удален!';
        Response.data = deleteResult;


    }//try
    catch(ex){

        Response.status = 500;
        Response.message = 'Ошибка сервера!';
        Response.data = ex;

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

        let comments = await Comment.find({

        } , 'id commentText' , {
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