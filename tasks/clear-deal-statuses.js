
const gulp = require('gulp');

const DealStatus = require('../model/DealsStatus');


gulp.task('clearDealStatuses' , async ( done )=>{

    try{

        console.log(await DealStatus.deleteMany());

    }//try
    catch(ex){

        console.log(ex)

    }//catch

    done();

});