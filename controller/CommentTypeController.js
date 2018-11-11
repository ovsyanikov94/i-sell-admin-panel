"use strict";

const Logger = require('../model/Logger');

const CommentType = require('../model/CommentType')
const UtilsController = require('../controller/UtilsController');
const Validation = require('../model/Validation')

module.exports.AddCommentType = async( req , res ) => {

    try{

        let reqType = req.body.statusTitle && req.body.statusTitle.trim();

        let newCommentType = null;

        try {

            newCommentType = new CommentType({

                CommentTypeTitle:reqType

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

        let createResult = await newCommentType.save();

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

module.exports.UpdateCommentType = async( req , res ) => {

    try{

        let commentTypeID = req.body.commentTypeID;
        let commentTypeText = req.body.commentTypeText;

        let updateCommentType = null;

        try {

            updateCommentType = await Comment.where({_id: commentTypeID}).update({CommentTypeTitle:commentTypeText});

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

        let updateResult = await updateCommentType.save();

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

module.exports.DeleteCommentType = async( req , res ) => {

    try{

        let commentTypeID = req.body.commentTypeID;

        let deleteCommentType = null;

        try {

            deleteCommentType = await Comment.remove({_id:commentTypeID});

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

        let deleteResult = await deleteCommentType.save();

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

module.exports.GetCommentsType = async( req , res ) => {

    try{

        let CommentTypes = await CommentType.find({
            skip: req.query.limit || Validation.COMMENT_DEFAULT_SKIP,
            limit: req.query.offset || Validation.COMMENT_DEFAULT_LIMIT
        });

        res.status(200);
        res.send({
            code: 200,
            data: CommentTypes,
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