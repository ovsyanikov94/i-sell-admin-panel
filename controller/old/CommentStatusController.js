/**
 * CommentStatusController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  createCommentStatus:async(req, res)=> {

    try {

      let reqStatus = req.body.statusTitle && req.body.statusTitle.trim();

      if(!reqStatus){

        return res.MainResponse( {
          statusCode: 400,
          data: req.body.statusTitle,
          message: 'Некорректные данные'
        });

      }//if

      let newStatus = await CommentStatus.create({
        'statusTitle':reqStatus
      }).fetch();

      res.MainResponse( {
        statusCode: 200,
        data: newStatus,
        message: 'Статус комментария добавлен'
      });

    }catch (ex){

      res.MainResponse( {
        statusCode: 500,
        data: null,
        message: 'Ошибка сервера'
      });

      console.log(ex);

    }//catch
  },//createStatus

  removeCommentStatus: async (req, res)=>{

    try{

      let statusId = req.body.idStatus;

      if(!statusId){

        return res.MainResponse( {
          statusCode: 400,
          data: req.body,
          message: 'Некорректные данные'
        });

      }//if

      let removeStatus = CommentStatus.destroy({
        'id':statusId
      }).fetch();

      res.MainResponse( {
        statusCode: 200,
        data: removeStatus,
        message: 'Статус удален'
      });


    }//try
    catch (ex){

      res.MainResponse( {
        statusCode: 500,
        data: null,
        message: 'Ошибка сервера'
      });

    }//catch

  },//removeStatus

  updateCommentStatus: async (req, res)=>{

    try{

      let statusId = req.body.idStatus;
      let updateTitle = req.body.statusTitle;

      if(_.isString(statusId)&&
        ( validator.isAlpha(req.body.statusTitle,'ru-RU')||
          validator.isAlpha(req.body.statusTitle))){

        let updateStatus = CommentStatus.update({
          'id':statusId
        },updateTitle).fetch();


        res.MainResponse( {
          statusCode: 200,
          data: updateStatus,
          message: 'Статус сделки обновлен'
        });
      }//if
      else {
        res.MainResponse( {
          statusCode: 400,
          data: req.body,
          message: 'Некорректные данные'
        });
      }//eles
    }
    catch (ex){
      res.MainResponse( {
        statusCode: 500,
        data: null,
        message: 'Ошибка сервера'
      });
    }

  },//updateStatus

  commentStatusList: async (req , res)=>{

    try {

      let statusList = await CommentStatus.find({
        select: [
          'id',
          'statusTitle'
        ]
      });

      res.MainResponse( {
        statusCode: 200,
        data: statusList,
        message: 'OK'
      });

    }catch (ex){

      res.MainResponse( {
        statusCode: 500,
        data: null,
        message: 'Ошибка сервера'
      });
    }

  },//dealsList

};

