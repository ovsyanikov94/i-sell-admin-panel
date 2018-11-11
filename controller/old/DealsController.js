/**
 * DealsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  addDeals: async (req,res)=>{//ОТКРЫТ ВОПРОС СО СТАТУСОМ

    try {
      let userSellerID = req.body.SellerID;
      let userCustomerId = req.body.CustomerId;
      let lotDealsId = req.body.lotId;

      if(userSellerID&&
        userCustomerId&&
        lotDealsId
      ){

        let userSeller = await User.findOne({id:userSellerID},{select: ['id']});
        let userCustomer = await User.findOne({id:userCustomerId},{select: ['id']});
        let lot = await Lot.findOne({id:lotDealsId},{select: ['id']});

        let newDeals = Deals.create({
          'userSeller':userSeller,
          'userCustomer':userCustomer,
          'lot':lot
        }).fetch();

        res.send({
          code:200,
          message:' сделка добавлен',
          data:newDeals
        });
      }//if
      else{
        res.send({
          code:400,
          message:'некорректные данные',
          data:req.body
        });
      }//else
    }//try
    catch (ex){
      res.send({
        code:500,
        message:'ощибка сервера'
      });
    }//catch
  },//addDeals
  transactionStatusDeal: async (req, res)=>{//ОТКРЫТ ВОПРОС С ФОРМАТОМ ДАТЫ!!!!!!!!!!!!!!!!

    try {
      let DealsId = req.body.DealtId
      let reqCommentDeals = req.body.comment;
      let reqEvaluation = req.body.evaluation;
      let reqDate = req.body.dateDeal;

      if(
        DealsId&&
        reqCommentDeals&&
        reqEvaluation&&
        reqDate
      ){

        let Review = ReviewDeals.create({
          'commentDeals':reqCommentDeals,
          'evaluation':reqEvaluation
        }).fetch();

        let Deal = Deals.findOne({id:DealsId});
        if(Deal){
         let updateDeal= Deal.updata({
           //ДАТУ СТАТУС
           'review':Review.id,
         })

        }//if
        else{
          res.send({
            code:400,
            message:'некорректные данные',
            data:req.body
          });
        }
      }//if
      else{
        res.send({
          code:400,
          message:'некорректные данные',
          data:req.body
        });
      }//else
    }//try
    catch (ex){
      res.send({
        code:500,
        message:'ощибка сервера'
      });
    }//catch
  }
};

