const gulp = require('gulp');

const LotStatus = require('../model/LotStatus');


gulp.task('clearLotStatuses' , async ( done )=>{

    try{

        console.log(await LotStatus.deleteMany());

    }//try
    catch(ex){

        console.log(ex)

    }//catch

    done();

});