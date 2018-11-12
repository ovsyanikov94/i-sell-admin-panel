"use strict";

const Logger = require('../model/Logger');

const CommentStatus = require('../model/CommentStatus');
const ValidatorConstants = require('../model/Validation');
const Response = require('../model/Response');

module.exports.AddCommentStatus = async( req , res ) => {

    try{

        let statusTitle = req.body.statusTitle && req.body.statusTitle.trim();

        if( !statusTitle.match( ValidatorConstants.COMMENT_STATUS_AND_TYPE_VALIDATOR ) ){

            Response.status = 400;
            Response.message = 'Название статуса комментария неверно!';
            Response.data = statusTitle;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if

        let newCommentStatus = null;

        try {

            newCommentStatus = new CommentStatus({

                commentStatusTitle:statusTitle

            });

        }//try
        catch(ex){

            Response.status = 400;
            Response.message = 'Статус комментария не был добавлен!';
            Response.data = newCommentStatus;

            res.status(Response.status);
            res.send(Response);

            return;

        }//catch

        let createResult = await newCommentStatus.save();

        Response.status = 200;
        Response.message = 'Статус комментария успешно добавлен';
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

module.exports.UpdateCommentStatus = async( req , res ) => {

    try{

        let commentStatusID = req.body.commentStatusID;

        if(!await CommentStatus.findOne({id: commentStatusID})){

            Response.status = 400;
            Response.message = 'Статус комментария с таким ID не был найден!';
            Response.data = commentStatusID;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let commentStatusText = req.body.commentStatusText;

        if( !commentStatusText.match( ValidatorConstants.COMMENT_STATUS_AND_TYPE_VALIDATOR ) ){

            Response.status = 400;
            Response.message = 'Название статуса комментария неверно!';
            Response.data = commentStatusText;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let updateCommentStatus = null;

        try {

            updateCommentStatus = await Comment.where({_id: commentStatusID}).update({CommentStatusTitle:commentStatusText});

        }//try
        catch(ex){

            Response.status = 400;
            Response.message = 'Статус комментария не был добавлен !';
            Response.data = updateCommentStatus;

            res.status(Response.status);
            res.send(Response);

            return;

        }//catch

        let updateResult = await updateCommentStatus.save();

        Response.status = 200;
        Response.message = 'Статус комментария успешно обновлен';
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

module.exports.DeleteCommentStatus = async( req , res ) => {

    try{

        let commentStatusID = req.body.commentStatusID;

        if(!await CommentStatus.findOne({id: commentStatusID})){

            Response.status = 400;
            Response.message = 'Комментарий с таким ID не был найден!';
            Response.data = commentStatusID;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let deleteCommentStatus = null;

        try {

            deleteCommentStatus = await Comment.remove({_id:commentStatusID});

        }//try
        catch(ex){

            Response.status = 400;
            Response.message = 'Статус комментария не был удален!';
            Response.data = deleteCommentStatus;

            res.status(Response.status);
            res.send(Response);

            return;

        }//catch

        let deleteResult = await deleteCommentStatus.save();

        Response.status = 200;
        Response.message = 'Статус комментария успешно удален';
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

module.exports.GetCommentStatus = async( req , res ) => {

    try{

        let commentStatus = await CommentStatus.find(null , 'id commentTypeTitle',{
            limit: +req.query.limit || ValidatorConstants.COMMENT_DEFAULT_LIMIT,
            skip: +req.query.offset || ValidatorConstants.COMMENT_DEFAULT_SKIP
        });

        Response.status = 200;
        Response.message = 'Список статусов комментариев: ';
        Response.data = commentStatus;

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