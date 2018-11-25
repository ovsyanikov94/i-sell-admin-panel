"use strict";

const gulp = require('gulp');
const Logger = require('../model/Logger');

const mark = require('../model/mark');

gulp.task('InsertDefaultMarkTitles', async ( done ) => {

    try{

        let markTitles = [

            new mark({
                "markTitle": "Дизлайк",
                "markValue": "0"
            }),
            new mark({
                "markTitle": "Лайк",
                "markValue": "1"
            })
        ];

        for( let i = 0 ; i < markTitles.length ; i++ ){

            let singleMark = markTitles[i];

            await singleMark.save();

        }//for i

        return markTitles;

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