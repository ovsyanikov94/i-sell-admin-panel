
const gulp = require('gulp');

const LotType = require('../model/LotType');


gulp.task('clearLotTypes' , async ( done )=>{

    try{

        console.log(await LotType.deleteMany());

    }//try
    catch(ex){

        console.log(ex)

    }//catch

    done();

});