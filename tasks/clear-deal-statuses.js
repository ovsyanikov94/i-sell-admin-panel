
const gulp = require('gulp');
const Logger = require('../model/Logger');
const DealStatus = require('../model/DealsStatus');


gulp.task('clearDealStatuses' , async ( done )=>{

    try{

        console.log(await DealStatus.deleteMany());

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