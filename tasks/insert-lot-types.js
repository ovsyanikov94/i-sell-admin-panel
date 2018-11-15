"use strict";

const gulp = require('gulp');

const LotType = require('../model/LotType');

gulp.task('InsertDefaultLotTypes' , async ( done )=> {

    try{

        let lotTypes = [
            new LotType({
                "typeTitle": "Запланированный ",
                "typeID": "1"
            }),
            new LotType({
                "typeTitle": "Немедленный ",
                "typeID": "2"
            }),

        ];

        for( let i = 0 ; i < lotTypes.length ; i++ ){

            let lotType = lotTypes[i];

            console.log(await lotType.save());


        }//for i

        return lotTypes;

    }//try
    catch(ex){

        console.log('EXCEPTION!');

    }//catch

    done();

});