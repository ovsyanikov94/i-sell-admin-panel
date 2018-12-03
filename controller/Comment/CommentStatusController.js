"use strict";

const Logger = require('../../model/Logger');

const CommentStatus = require('../../model/CommentStatus');
const ValidatorConstants = require('../../model/Validation');
const Response = require('../../model/Response');

module.exports.GetCommentStatus = async( req , res ) => {

    try{

        let commentStatus = await CommentStatus.find(null , 'id commentStatusTitle commentStatusID',{
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