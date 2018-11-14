"use strict";

const gulp = require('gulp');

const LotStatus = require('../model/LotStatus');

gulp.task('InsertDefaultLotStatuses' , async ( done )=> {

    try{

        let lotStatuses = [
            new LotStatus({
                "statusTitle": "Активный",
                "statusID": "1"
            }),
            new LotStatus({
                "statusTitle": "На проверке",
                "statusID": "2"
            }),
            new LotStatus({
                "statusTitle": "Отклоненный",
                "statusID": "3"
            }),

            new LotStatus({
                "statusTitle": "Закрытый",
                "statusID": "4"
            }),
        ];

        for( let i = 0 ; i < lotStatuses.length ; i++ ){

            let lotstatus = lotStatuses[i];

            console.log(await lotstatus.save());


        }//for i

        return lotStatuses;

    }//try
    catch(ex){

        console.log('EXCEPTION!');

    }//catch

    done();

});