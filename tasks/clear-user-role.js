"use strict";
const gulp = require('gulp');
const Logger = require('../model/Logger');

const UserRole = require('../model/UserRole');


gulp.task('clearUserRoles' , async ( done )=>{

    try{

        console.log(await UserRole.deleteMany());

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