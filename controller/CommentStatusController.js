"use strict";

const Logger = require('../model/Logger');

const CommentStatus = require('../model/CommentStatus')
const UtilsController = require('../controller/UtilsController');
const Validation = require('../model/Validation')

module.exports.AddCommentStatus = async( req , res ) => {

    try{

        let reqStatus = req.body.statusTitle && req.body.statusTitle.trim();

        let newCommentStatus = null;

        try {

            newCommentStatus = new CommentStatus({

                commentStatusTitle:reqStatus

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

        let createResult = await newCommentStatus.save();

        res.status(200);
        res.send({
            code: 200,
            data: newCommentStatus,
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

module.exports.UpdateCommentStatus = async( req , res ) => {

    try{

        let commentStatusID = req.body.commentStatusID;
        let commentStatusText = req.body.commentStatusText;

        let updateCommentStatus = null;

        try {

            updateCommentStatus = await Comment.where({_id: commentStatusID}).update({commentStatusTitle:commentStatusText});

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

        let updateResult = await updateCommentStatus.save();

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

module.exports.DeleteCommentStatus = async( req , res ) => {

    try{

        let commentStatusID = req.body.commentStatusID;

        let deleteCommentStatus = null;

        try {

            deleteCommentStatus = await Comment.remove({_id:commentStatusID});

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

        let deleteResult = await deleteCommentStatus.save();

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

module.exports.GetCommentsStatuses = async( req , res ) => {

    try{

        let commentStatuses = await CommentStatus.find({
            skip: req.query.limit || Validation.COMMENT_DEFAULT_SKIP,
            limit: req.query.offset || Validation.COMMENT_DEFAULT_LIMIT
        });

        res.status(200);
        res.send({
            code: 200,
            data: commentStatuses,
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