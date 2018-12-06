"use strict";

const Lot = require('../../model/Lot');
const Bidding = require('../../model/Bidding');
const User = require('../../model/User');
const Logger = require('../../model/Logger');
const ValidatorConstants = require('../../model/Validation');

const moment = require('moment');

const Response = require('../../model/Response');


module.exports.AddRate = async( req , res ) => {


    try{

        let userId = req.session.passport.user._id;
        let rate = req.body.rate;
        let lotId = req.body.lotId;

        let findLot = await Lot.findById(lotId);

        if(!findLot){
            Response.status = 400;
            Response.message = 'лот не найден';
            Response.data = lotId;

            res.status(Response.status);
            res.send(Response);

            return;
        }
        let dateRate = moment(new Date()).unix()

        if(!rate || rate < ValidatorConstants.LOT_RATE){
            Response.status = 400;
            Response.message = 'Ставка указана неверно';
            Response.data = null;

            res.status(Response.status);
            res.send(Response);

            return;
        }//if

        let newBidding = null;
        try {

            newBidding = new Bidding({
                'user': userId,
                'rate': rate,
                'dateRate': dateRate,
            });



        }//try
        catch(ex){


            Response.status = 400;
            Response.message = ex.message;

            res.status(Response.status);
            res.send(Response);

            return ;

        }//catch

        let currentBidding  = await newBidding.save();

        findLot.biddings.push(currentBidding._id);
        await findLot.save();

        await Lot.findByIdAndUpdate(findLot._id, { currentRate: rate });

        Response.status = 200;
        Response.message = 'Торги добавлены';
        Response.data = currentBidding;


    }//try
    catch(ex){

        Logger.error({
            time: new Date().toISOString(),
            status: 500,
            data: {
                message: ex.message,
                stack: ex.stack
            },
        });

        Response.status = 500;
        Response.message = ex.message;
        Response.data = ex.message;



    }//catch

    res.status(Response.status);
    res.send(Response);

};
