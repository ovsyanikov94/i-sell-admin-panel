"use strict";

const Logger = require('../model/Logger');

const CommentType = require('../model/CommentType');
const ValidatorConstants = require('../model/Validation')
const Response = require('../model/Response');

module.exports.GetCommentsType = async( req , res ) => {

    try{

        let commentTypes = await CommentType.find(null , 'id commentTypeTitle commentTypeID',{
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