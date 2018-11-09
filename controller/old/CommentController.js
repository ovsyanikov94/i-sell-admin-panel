/**
 * CommentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require('moment');
// const moment = require('moment');

module.exports = {

  test: async( req ,res )=>{

    let formatDate = moment().format('HH:mm');

    let ip = '12432refwds';

    let result = validator.isIP(ip);


    sails.log.error({
      time: formatDate,
      status: 500,
      data: [
        1,2,3,4,5, 'HellO!'
      ],
      message: 'ERROR!'
    });

    res.send( result );

  },

  createComment: async ( req , res )=>{

    try{

      let commentText = req.body.commentText && req.body.commentText.trim();

      if(!commentText || commentText.length < Validation.COMMENT_MIN_LENGTH || commentText.length > Validation.COMMENT_MAX_LENGTH){

        return res.MainResponse( {
          statusCode: 400,
          message: 'Несоответсвующая длина комментария!'
        });

      }//if

      let commentStatusTitle = req.body.commentStatus;

      let commentStatus = await CommentStatus.findOne({
        statusTitle:commentStatusTitle
      });

      if(!commentStatus){

        return res.MainResponse( {
          statusCode: 400,
          message: 'Некорректный статус комментария!'
        });

      }//if

      let commentTypeTitle = req.body.commentType;

      let commentType = await CommentType.findOne({
        typeTitle:commentTypeTitle
      });

      if(!commentType){

        return res.MainResponse( {
          statusCode: 400,
          message: 'Некорректный тип комментария!'
        });

      }//if

      let commentSendDate = req.body.commentSendDate;

      // if( !commentSendDate.match(Comment.commentSendDate.regex) ){
      //
      //   return res.MainResponse( {
      //     statusCode: 400,
      //     message: 'Incorrect date!'
      //   });
      //
      //
      // }//if

      let userSenderID = req.body.userSender;

      if( ! userSenderID ){

        return res.MainResponse( {
          statusCode: 400,
          message: 'Некорретный ID отправителя!'
        });

      }//if

      let userSender = await User.findOne({id:userSenderID});

      if(!userSender){

        return res.MainResponse( {
          statusCode: 400,
          message: 'Отрпавитель с таким ID не был найден!'
        });

      }//if

      let newComment = await Comment.create({

        "commentText": commentText,
        "commentStatus": commentStatus.id,
        "commentType": commentType.id,
        "commentSendDate": commentSendDate,
        "userSender": userSender.id

      }).fetch();

      // if(commentType === "personal"){
      //
      //   let userReceiverID = req.body.userReceiver;`
      //
      //   if( !userReceiverID ){
      //
      //     return res.MainResponse( {
      //       statusCode: 400,
      //       message: 'Некорректный ID получателя!'
      //     });
      //
      //   }//if
      //
      //   await Comment.addToCollection(newComment.id,'userReceiver').members(userReceiverID);
      //
      // }//if

      // else if(commentType === "lot"){
      //
      //   let lotID = req.body.lotID;
      //
      //   if( !lotID ){
      //
      //     return res.MainResponse( {
      //       statusCode: 400,
      //       message: 'Некорректный ID лота!'
      //     });
      //
      //   }//if
      //
      //   let lot = await Lot.findOne({id:lotID});
      //
      //   if(!lotID){
      //
      //     return res.MainResponse( {
      //       statusCode: 400,
      //       message: 'Лот с таким ID не был найден!'
      //     });
      //
      //   }//if
      //
      //   await Comment.addToCollection(newComment.id,'lot').members(lotID);
      //
      // }//else if

      res.MainResponse({

        statusCode: 200,
        data: newComment,
        message: 'Успешно!'

      });

    }//try
    catch(ex){

      res.send(ex);

      console.log(ex);

    }//catch

  },//createComment

  updateComment: async ( req , res )=>{

    try{

      let commentID = req.params.id;

      if(commentID.length === 0){

        return res.MainResponse( {
          statusCode: 400,
          message: 'Введите ID комментария!'
        });

      }//if

      let commentText = req.body.commentText;

      if(commentText.length < Validation.COMMENT_MIN_LENGTH || commentText.length > Validation.COMMENT_MAX_LENGTH){

        return res.MainResponse( {
          statusCode: 400,
          message: 'Комментарий вне диапазона!'
        });

      }//if


      let updatedComment = await Comment.findOne({id:commentID});

      if(!updatedComment){

        return res.MainResponse( {
          statusCode: 400,
          message: 'Такой комментарий не существует!'
        });

      }//if

      updatedComment = await Comment.update({id: updatedComment.id} , {commentText:commentText}).fetch();

      return res.MainResponse( {
        statusCode: 200,
        data:updatedComment,
        message: 'Успешно!'
      });


    }//try
    catch(ex){

      res.send(ex);

    }//catch

  },//updateComment

  deleteComment: async ( req , res )=>{

    try{

      let commentID = req.params.id;

      if(commentID.length === 0){

        return res.MainResponse( {
          statusCode: 400,
          message: 'Введите ID!'
        });

      }//if

      let deleteComment = await Comment.findOne({id:commentID});

      if(!deleteComment){

        return res.MainResponse( {
          statusCode: 400,
          message: 'Такого комментария не существует!'
      });

      }//if

      deleteComment = await Comment.destroy({id:deleteComment.id}).fetch();

      return res.MainResponse( {
        statusCode: 200,
        deleteComment,
        message: 'Успешно!'
      });

    }//try
    catch(ex){

      res.send(ex);

    }//catch

  },//deleteComment

  commentsList: async ( req , res ) => {

    try{

      let comments = await Comment.find({
        skip: req.query.limit || Validation.COMMENT_DEFAULT_SKIP,
        limit: req.query.offset || Validation.COMMENT_DEFAULT_LIMIT
      });

      res.MainResponse( {
        statusCode: 200,
        data: comments,
        message: 'Успешно!'
      });

    }//try
    catch(ex){

      res.send(ex);

    }//catch

  }//getCommentsList

};

