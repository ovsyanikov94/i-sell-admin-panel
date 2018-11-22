"use strict";

const gulp = require('gulp');
const Logger = require('../model/Logger');
const category = require('../model/Category');

gulp.task('InsertCategory', async ( done )=> {

    try{

        let Category = [
            new category({
                "title": "Телефоны"

            }),
            new category({
                "title": "Аксессуары"

            }),
        ];

        for( let i = 0 ; i < Category.length ; i++ ){

            let cat = Category[i];

            console.log(await cat.save());


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

    //done();

});