"use strict";

const gulp = require('gulp');
const Logger = require('../model/Logger');
const DealStatus = require('../model/DealsStatus');

gulp.task('InsertDefaultDealStatuses' , async ( done )=> {

    try{

        let dealsStatuses = [
            new DealStatus({
                "titleStatus": "Отклонена",
                "dealID": "1"
            }),
            new DealStatus({
                "titleStatus": "Подтверждена",
                "dealID": "2"
            }),
            new DealStatus({
                "titleStatus": "В обработке",
                "dealID": "3"
            }),
        ];

        for( let i = 0 ; i < dealsStatuses.length ; i++ ){

            let deal = dealsStatuses[i];

            console.log(await deal.save());


        }//for i

        //return dealsStatuses;

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

    }//catch

    done();

});