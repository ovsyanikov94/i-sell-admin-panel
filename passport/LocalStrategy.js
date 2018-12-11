"use strict";

const User = require('../model/User');

const LocalStrategy = require('passport-local').Strategy;

module.exports = function ( passport ) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(async function(user, done) {

       // console.log('DESERIALIZE: ' , user);

        try{

            let userCheck = await User.findById(
                user._id ,
                '_id'
            );

            if(userCheck){
                done(null , user);
            }//if

        }//try
        catch(ex){
            done(ex);
        }//catch

    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'userLogin',    // req.body.userLogin
            passwordField: 'userPassword'  // req.body.userPassword
        },

        async function(login, password, done) {

            try{

                let user = await User.findOne(
                    {
                        $or:[
                            {userLogin: login },
                            {userEmail: login }
                        ],

                    } , 'userLogin userEmail userPassword role')
                    .populate('role');

                //console.log('user: ' , user);

                if(!user){
                    return done(null, false);
                }//if

                let checkPassword = await user.verifyPassword( password );

                if( !checkPassword ){
                    return done(null , false);
                }//if

                done(null, user);

            }//try
            catch(ex){
                return done(ex);
            }//catch

        }// async fd

    ));
};