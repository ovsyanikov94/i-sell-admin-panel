"use strict";

const LotStatus = require('../model/LotStatus');


module.exports.AddLotStatus = async( req , res )=>{

    try{

        let title = req.body.statusTitle;

        let newStatus= new LotStatus({
            'statusTitle': title
        });

        let result = await newStatus.save();

        res.send({
            code: 200,
            data: result,
            message:  'Статус добавлен!'
        });


    }//try
    catch(ex){

        res.send( ex.message );

    }//catch

};
