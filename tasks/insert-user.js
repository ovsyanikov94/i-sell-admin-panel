"use strict";

const gulp = require('gulp');
const Logger = require('../model/Logger');
const User = require('../model/User');
const Admin = require('../model/Admin');
const UserStatusEnum = require('../model/Enums/UserStatus');
const UserRoleEnum = require('../model/Enums/UserRole');
const UserRole = require('../model/UserRole');
const UserStatus = require('../model/UserStatus');
const bcrypt = require('bcrypt');


gulp.task('InsertRootAdmin' , async ( done )=> {

    try{
        let role = await UserRole.findOne(
            {
                userRoleId: UserRoleEnum.ADMIN
            },
            '_id'
        );

        let status = await UserStatus.findOne(
            {
                userStatusId: UserStatusEnum.ACTIVE
            },
            '_id'
        );

        let number = Math.floor(Math.random() * (19 - 9+1) ) + 5; //генерируем случайное число символов от 9 до 19
        let saltStr = await bcrypt.genSalt(number);// создаем соль
        let hexPassword = await bcrypt.hash('123456', saltStr); // получаем закодированный пароль

        let newUser =new User({
            "userLogin": "rootAdmin",
            "userPassword": hexPassword,
            "userEmail": "rootAdmin@gmail.com",
            "userName": "Root",
            "userLastname": "Admin",
            "userPhone": "+38(066)911-11-11",
            "role": role._id,
            "userStatus": status._id,
            //userPhoto:pathUserImage,
        });


        let currentUser = await newUser.save();


        let rootAdmin = new Admin({
            userBase: currentUser._id
        });
        await rootAdmin.save();

        return rootAdmin;

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