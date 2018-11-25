"use strict";

const gulp = require('gulp');

const Logger = require('../model/Logger');

const mark = require('../model/mark');

gulp.task('clearMarkTitles', async ( done ) =>{

    try{

        await mark.deleteMany();

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