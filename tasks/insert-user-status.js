"use strict";

const gulp = require('gulp');
const Logger = require('../model/Logger');
const UserStatus = require('../model/UserStatus');

gulp.task('InsertDefaultUserStatuses' , async ( done )=> {

    try{

        let UserStatuses = [
            new UserStatus({
                "statusTitle": "Активный",
                "userStatusId": 1
            }),
            new UserStatus({
                "statusTitle": "Анонимный",
                "userStatusId": 2
            }),
            new UserStatus({
                "statusTitle": "Не верифицированный ",
                "userStatusId": 3
            }),
            new UserStatus({
                "statusTitle": "Заблокированный ",
                "userStatusId": 4
            }),
        ];

        for( let i = 0 ; i < UserStatuses.length ; i++ ){

            let status = UserStatuses[i];

            console.log(await status.save());


        }//for i

        return UserStatuses;

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