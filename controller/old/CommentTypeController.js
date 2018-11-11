/**
 * CommentTypeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  createCommentType:async(req, res)=> {

    try {

      let reqType = req.body.typeTitle && req.body.typeTitle.trim();

      if(!reqType){

        return res.MainResponse( {
          statusCode: 400,
          data: req.body.reqType,
          message: 'Некорректные данные'
        });

      }//if

      let newType = await CommentType.create({
        'typeTitle':reqType
      }).fetch();

      res.MainResponse( {
        statusCode: 200,
        data: newType,
        message: 'Тип комментария добавлен'
      });

    }catch (ex){

      res.MainResponse( {
        statusCode: 500,
        data: null,
        message: 'Ошибка сервера'
      });

    }//catch
  },//createStatus

  removeCommentType: async (req, res)=>{

    try{

      let typeId = req.body.typeID;

      if(!typeId){

        return res.MainResponse( {
          statusCode: 400,
          data: req.body,
          message: 'Некорректные данные'
        });

      }//if

      let removeType = CommentType.destroy({
        'id':typeId
      }).fetch();

      res.MainResponse( {
        statusCode: 200,
        data: removeStatus,
        message: 'Тип удален'
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

  updateCommentType: async (req, res)=>{

    try{

      let typeId = req.body.typeID;
      let updateTitle = req.body.typeTitle;

      if(_.isString(typeId)&&
        ( validator.isAlpha(req.body.typeTitle,'ru-RU')||
          validator.isAlpha(req.body.typeTitle))){

        let updateType = CommentType.update({
          'id':typeId
        },updateTitle).fetch();


        res.MainResponse( {
          statusCode: 200,
          data: updateType,
          message: 'Тип комментария обновлен'
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

  commentTypeList: async (req , res)=>{

    try {

      let typeList = await CommentType.find({
        select: [
          'id',
          'typeTitle'
        ]
      });

      res.MainResponse( {
        statusCode: 200,
        data: typeList,
        message: 'OK'
      });

    }catch (ex){

      res.MainResponse( {
        statusCode: 500,
        data: null,
        message: 'Ошибка сервера'
      });
    }

  },//typeList

};

