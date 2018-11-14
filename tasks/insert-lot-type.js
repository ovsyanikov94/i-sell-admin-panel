"use strict";

const gulp = require('gulp');

const LotType = require('../model/LotType');

gulp.task('InsertLotType' , async ( done )=> {

    try{

        let LotTypes = [
            new LotType({
                "titleStatus": "Запланированный",
                "dealID": "1"
            }),
            new LotType({
                "titleStatus": "Немедленный",
                "dealID": "2"
            }),
        ];

        for( let i = 0 ; i < LotTypes.length ; i++ ){

            let lType = LotTypes[i];

            console.log(await lType.save());


        }//for i

        //return LotTypes;

    }//try
    catch(ex){

        console.log('EXCEPTION!');

    }//catch

    done();

});