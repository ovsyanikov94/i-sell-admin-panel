/**
 * StatusDealsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  createStatus:async(req, res)=> {

    try {

      if(req.body.statusTitle){
        let reqStatus = (req.body.statusTitle).trim();

        let newStatus = await statusDeals.create({
          'statusTitle':reqStatus
        }).fetch();
        res.send({
          code:200,
          message:' статус сделки добавлен',
          data:newStatus
        });
      }//if
      else {
        res.send({
          code:400,
          message:'некорректные данные',
          data:reqStatus
        });
      }//else


    }catch (ex){
      res.send({
        code:500,
        message:'ощибка сервера'
      });
    }
  },//createStatus

  removeStatus: async (req, res)=>{

      try{

        let statusId = req.body.idStatus;
        if(statusId){

          let removeStatus = statusDeals.destroy({
            'id':statusId
          }).fetch();

          res.send({
            code:200,
            message:' статус сделки удален',
            data:removeStatus
          });
        }//if
        else {
          res.send({
            code:400,
            message:'некорректные данные',
            data:statusId
          });
        }//eles
      }
      catch (ex){
        res.send({
          code:500,
          message:'ощибка сервера'
        });
      }

  },//removeStatus

  updateStatus: async (req, res)=>{

    try{

      let statusId = req.body.idStatus;
      let updateTitle = req.body.statusTitle;

      if(statusId&& updateTitle){

        let updateStatus = statusDeals.update({
          'id':statusId
        },updateTitle).fetch();

        res.send({
          code:200,
          message:' статус сделки удален',
          data:updateStatus
        });
      }//if
      else {
        res.send({
          code:400,
          message:'некорректные данные',
          data:statusId
        });
      }//eles
    }
    catch (ex){
      res.send({
        code:500,
        message:'ощибка сервера'
      });
    }

  },//updateStatus
  statusList: async (req , res)=>{

    try {

      let dealsList = statusDeals.find({
        select: [
          'id',
          'statusTitle'
        ]
      });

      res.send({
        code:200,
        message:'OK',
        data:dealsList
      });

    }catch (ex){

      res.send({
        code:500,
        message:'ощибка сервера'
      });

    }

  },//dealsList

  statusListByDeals: async(req,res)=>{

    try {
      let statusId = req.body.idStatus;

      if(statusId){

        let dealsByStatus = statusDeals.find({
          where:{
            'id': statusId
          }
        }).populate('deals');

        res.send({
          code:200,
          message:'OK',
          data:dealsByStatus
        });
      }//if
      else{
        res.send({
          code:400,
          message:'некорректные данные',
          data:statusId
        });
      }//else
    }
    catch (ex){
      res.send({
        code:500,
        message:'ощибка сервера'
      });
    }
  },//dealsList
};

