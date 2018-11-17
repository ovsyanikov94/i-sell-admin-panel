"use strict";

const Logger = require('../model/Logger');

const CommentType = require('../model/CommentType');
const ValidatorConstants = require('../model/Validation')
const Response = require('../model/Response');

module.exports.AddCommentType = async( req , res ) => {

    try{

        let typeTitle = req.body.typeTitle && req.body.typeTitle.trim();

        if( !typeTitle.match( ValidatorConstants.COMMENT_STATUS_AND_TYPE_VALIDATOR ) ){

            Response.status = 400;
            Response.message = 'Название типа комментария неверно!';
            Response.data = typeTitle;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if

        let newCommentType = null;

        try {

            newCommentType = new CommentType({

                commentTypeTitle:typeTitle

            });

        }//try
        catch(ex){

            Response.status = 400;
            Response.message = 'Тип комментария не был добавлен!';
            Response.data = newCommentType;

            res.status(Response.status);
            res.send(Response);

            return;

        }//catch

        let createResult = await newCommentType.save();

        Response.status = 200;
        Response.message = 'Тип комментария успешно добавлен';
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

module.exports.UpdateCommentType = async( req , res ) => {

    try{

        let commentTypeID = req.body.commentTypeID;

        if(!await CommentType.findOne({id: commentTypeID})){

            Response.status = 400;
            Response.message = 'Тип комментария с таким ID не был найден!';
            Response.data = commentTypeID;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let commentTypeText = req.body.commentTypeText;

        if( !commentTypeText.match( ValidatorConstants.COMMENT_STATUS_AND_TYPE_VALIDATOR ) ){

            Response.status = 400;
            Response.message = 'Название типа комментария неверно!';
            Response.data = commentTypeText;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let updateCommentType = null;

        try {

            updateCommentType = await Comment.where({_id: commentTypeID}).update({CommentTypeTitle:commentTypeText});

        }//try
        catch(ex){

            Response.status = 400;
            Response.message = 'Тип комментария не был добавлен !';
            Response.data = updateCommentType;

            res.status(Response.status);
            res.send(Response);

            return;

        }//catch

        let updateResult = await updateCommentType.save();

        Response.status = 200;
        Response.message = 'Тип комментария успешно обновлен';
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

module.exports.DeleteCommentType = async( req , res ) => {

    try{

        let commentTypeID = req.body.commentTypeID;

        if(!await CommentType.findOne({id: commentTypeID})){

            Response.status = 400;
            Response.message = 'Комментарий с таким ID не был найден!';
            Response.data = commentTypeID;

            res.status(Response.status);
            res.send(Response);

            return;

        }//if

        let deleteCommentType = null;

        try {

            deleteCommentType = await Comment.remove({_id:commentTypeID});

        }//try
        catch(ex){

            Response.status = 400;
            Response.message = 'Тип комментария не был удален!';
            Response.data = deleteCommentType;

            res.status(Response.status);
            res.send(Response);

            return;

        }//catch

        let deleteResult = await deleteCommentType.save();

        Response.status = 200;
        Response.message = 'Тип комментария успешно удален';
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

module.exports.GetCommentsType = async( req , res ) => {

    try{

        let commentTypes = await CommentType.find(null , 'id commentStatusTitle',{
            limit: +req.query.limit || ValidatorConstants.COMMENT_DEFAULT_LIMIT,
            skip: +req.query.offset || ValidatorConstants.COMMENT_DEFAULT_SKIP
        });

        Response.status = 200;
        Response.message = 'Список типов комментариев: ';
        Response.data = commentTypes;

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