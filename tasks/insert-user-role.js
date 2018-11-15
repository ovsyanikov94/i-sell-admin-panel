"use strict";

const gulp = require('gulp');
const Logger = require('../model/Logger');
const UserRole = require('../model/UserRole');

gulp.task('InsertDefaultUserRoles' , async ( done )=> {

    try{

        let UserRoles = [
            new UserRole({
                "roleTitle": "Администратор",
                "userRoleId": 1
            }),
            new UserRole({
                "roleTitle": "Модератор",
                "userRoleId": 2
            }),
            new UserRole({
                "roleTitle": "Зарегистрированный",
                "userRoleId": 3
            }),
            new UserRole({
                "roleTitle": "Анонимный пользователь",
                "userRoleId": 4
            }),
        ];

        for( let i = 0 ; i < UserRoles.length ; i++ ){

            let role = UserRoles[i];

            console.log(await role.save());


        }//for i

        return UserRoles;

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