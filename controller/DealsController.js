'use strict';

const Logger = require('../model/Logger');
const UtilsController = require('../controller/UtilsController');
const Deals = require('../model/Daels');
const DealsStatus = require('../model/DealsStatus');
const validator = require('validator');
const evaluation = require('../model/evaluationDeals');
const constValidator = require('../model/validatorConstatn');
const User = require();
module.exports.createDeals=async(req,res)=>{

    let validSellerUser =  validator.isMongoId( req.body.sellerUserID);
    let validCustomerUser =validator.isMongoId( req.body.customerUserID);
    let validLot =validator.isMongoId(req.body.lotID);
       if(!validSellerUser||
           !validCustomerUser||
           !validLot){
           res.send( {
               code: 400,
               message: "не корректное значени!",
               data: idStatusDeal
           } );
           return;
       }//if
    let lotInDeal = await Daels.find().populate({
        lot: req.body.lotID
    });

    if(lotInDeal){
        res.status(400);
        res.send( {
            code: 400,
            message: 'лот уже в сделке',
            data:req.body.lotID
        } );//res.send

        return;
    }//if

   try {
        let newDeals=null
           try {
                newDeals =new Daels({
                   sellerUser:req.body.sellerUserID,
                   customerUser:req.body.customerUserID,
                   lot:req.body.lotID
                    //статус!!!!!!!!!!!!!!!
               });//newDeals
           }//try
           catch (ex){
               let message = UtilsController.MakeMongooseMessageFromError(ex);

               res.status(400);
               res.send( {
                   code: 400,
                   message: message
               } );//res.send

               return;
           }//catch

            let Daels = await newDeals.save();

       res.status(200);
       res.send({
           code: 200,
           data:Daels ,
           message:  'сделка успешно долбавлена!'
       });// res.send

   }//try
   catch (ex){
       Logger.error({
           time: new Date().toISOString(),
           status: 500,
           data: {
               message: ex.message,
               stack: ex.stack
           },
       });//Logger.error
       res.status(500);

       res.send( {
           code: 500,
           message: "Внутренняя ошибка сервера!",
           data: ex
       } );// res.send
   }//catch

},

module.exports.listDealByUserId = async(req,res)=>{
    let validUserId = validator.isMongoId( req.body.userId);
    let validStatusId =validator.isMongoId( req.body.statusId);

    if(!validUserId||
        !validStatusId
    ){
        res.send( {
            code: 400,
            message: "не корректное значени!",
            data: idStatusDeal
        } );
        return;
    }
    try {

    let existStatus =await DealsStatus.find({
        id:req.body.statusId
    });
    if(!existStatus){
        res.send( {
            code: 400,
            message: "не корректное значени!",
            data: title
        } );
        return;
    }//if

    let existUser = await User.find({
        id:req.body.userId
    });
    if(!existUser){
        res.send( {
            code: 400,
            message: "не корректное значени!",
            data: title
        } );
        return;
    }//if


        let infoDeaByUser = await Deals.find({
            dealsStatus:req.body.statusId
        }).or([{sellerUser:req.body.userId},{customerUser:req.body.userId}]);


        res.status(200);
        res.send({
            code: 200,
            data: infoDeaByUser,
            message:  'OK'
        });// res.send
    }
    catch (ex){
        Logger.error({
            time: new Date().toISOString(),
            status: 500,
            data: {
                message: ex.message,
                stack: ex.stack
            },
        });//Logger.error
        res.status(500);

        res.send( {
            code: 500,
            message: "Внутренняя ошибка сервера!",
            data: ex
        } );// res.send
    }

}
module.exports.closeDeals=async(req,res)=>{

    let validDealsId = validator.isMongoId( req.body.dealsId);
    let validStatusId =validator.isMongoId( req.body.statusId);
    let validEvoluationText = constValidator.STATUS_EVALUATION_TEXT_VALIDATOR.test(req.body.textEvaluation);
    let validEvaluationValue = constValidator.STATUS_EVALUATION_VALUE_VALIDATOR.test(req.body.valueEvaluation);
    if(!validDealsId||
        !validStatusId||
        !validEvoluationText||
        !validEvaluationValue
    ){
        res.send( {
            code: 400,
            message: "не корректное значени!",
        } );
        return;
    }

    let existStatus =await DealsStatus.find({
        id:req.body.statusId
    });
    if(!existStatus){
        res.send( {
            code: 400,
            message: "не корректное значени!",
            data: req.body.statusId
        } );
        return;
    }//if

    let existDeal = await Deals.find({
        id:req.body.dealsId
    });
    if(!existDeal){
        res.send( {
            code: 400,
            message: "не корректное значени!",
            data: req.body.dealsId
        } );
        return;
    }//if
    try {

        let newEvaluation = null;
        try {
             newEvaluation = new evaluation({
                EvaluationText:req.body.textEvaluation,
                EvaluationValue:req.body.valueEvaluation,
                deals:req.body.dealsId
            });
        }//try
        catch (ex){
            let message = UtilsController.MakeMongooseMessageFromError(ex);

            res.status(400);
            res.send( {
                code: 400,
                message: message
            } );//res.send

            return;
        }//catch

        let DealEvaluation =await newEvaluation.save();
        existDeal.set({
           // dealsStatus:req.body.statusId,
            evaluation:DealEvaluation.id,
            dataDeals: new Date().getTime()

        });

        let closeDeal = await existDeal.save();



        res.status(200);
        res.send({
            code: 200,
            data: closeDeal,
            message:  'OK'
        });// res.send

    }
    catch (ex){
        Logger.error({
            time: new Date().toISOString(),
            status: 500,
            data: {
                message: ex.message,
                stack: ex.stack
            },
        });//Logger.error
        res.status(500);

        res.send( {
            code: 500,
            message: "Внутренняя ошибка сервера!",
            data: ex
        } );// res.send
    }

}