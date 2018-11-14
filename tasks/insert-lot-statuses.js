"use strict";

const gulp = require('gulp');

const LotStatus = require('../model/LotStatus');

gulp.task('InsertDefaultLotStatuses' , async ( done )=> {

    try{

        let lotsStatuses = [
            new LotStatus({
                "titleStatus": "Активный",
                "lotStatusID": "1"
            }),
            new LotStatus({
                "titleStatus": "На проверке ",
                "lotStatusID": "2"
            }),
            new LotStatus({
                "titleStatus": "Отклоненный",
                "lotStatusID": "3"
            }),
            new LotStatus({
                "titleStatus": "Закрытый",
                "lotStatusID": "4"
            }),
        ];

        for( let i = 0 ; i < lotsStatuses.length ; i++ ){

            let deal = lotsStatuses[i];

            console.log(await deal.save());


        }//for i

        return lotsStatuses;

    }//try
    catch(ex){

        console.log('EXCEPTION!');

    }//catch

    done();

});