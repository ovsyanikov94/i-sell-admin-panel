"use strict";

const LotType = require('../model/LotType');


module.exports.AddLotType = async( req , res )=>{

    try{

        let title = req.body.typeTitle;

        let newType= new LotType({
            'typeTitle': title
        });

        let result = await newType.save();

        res.send({
            code: 200,
            data: result,
            message:  'Тип добавлен!'
        });


    }//try
    catch(ex){

        res.send( ex.message );

    }//catch

};
