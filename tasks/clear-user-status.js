
const gulp = require('gulp');
const Logger = require('../model/Logger');

const UserStatus = require('../model/UserStatus');


gulp.task('clearUserStatuses' , async ( done )=>{

    try{

        console.log(await UserStatus.deleteMany());

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