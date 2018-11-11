"use strict";

const Lot = require('../model/Lot');
const User = require('../model/User')
const Logger = require('../model/Logger');

const UtilsController = require('../controller/UtilsController');
const Validation = require('../model/Validation')

module.exports.AddComment = async( req , res ) => {

    try{

        let commentText = req.body.commentText && req.body.commentText.trim();
        let commentStatus = req.body.commentStatus;
        let commentType = req.body.commentType;
        let commentSendDate = req.body.commentSendDate;

        let newComment = null;

        try {

            newComment = new Comment({

                commentText: commentText,
                commentStatus: commentStatus,
                commentType: commentType,
                commentSendDate: commentSendDate

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

        if(commentType === Validation.COMMENT_TYPE_PERSONAL ){

            try{

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

            newComment.addFields({

            });

        }//if

        else if (commentType === Validation.COMMENT_TYPE_LOT){


            try{

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

            newComment.addFields({

            });

        }//else

        let createResult = await newComment.save();

        res.status(200);
        res.send({
            code: 200,
            data: createResult,
            message:  'Комментарий успешно добавлен!'
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

module.exports.UpdateComment = async( req , res ) => {

    try{

        let commentID = req.body.commentID;
        let commentText = req.body.commentText;

        let updateComment = null;

        try {

            updateComment = await Comment.where({_id: commentID}).update({commentText:commentText});

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

        let updateResult = await updateComment.save();

        res.status(200);
        res.send({
            code: 200,
            data: updateResult,
            message:  'Комментарий успешно обновлен'
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

module.exports.DeleteComment = async( req , res ) => {

    try{

        let commentID = req.body.commentID;

        let deleteComment = null;

        try {

            deleteComment = await Comment.remove({_id:commentID});

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

        let deleteResult = await deleteComment.save();

        res.status(200);
        res.send({
            code: 200,
            data: deleteResult,
            message:  'Комментарий успешно удален'
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

module.exports.GetComments = async( req , res ) => {

    try{

        let comments = await Comment.find({
            skip: req.query.limit || Validation.COMMENT_DEFAULT_SKIP,
            limit: req.query.offset || Validation.COMMENT_DEFAULT_LIMIT
        });

        res.status(200);
        res.send({
            code: 200,
            data: comments,
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