"use strict";

const User = require('../model/User');

const LocalStrategy = require('passport-local').Strategy;

module.exports = function ( passport ) {

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(async function(id, done) {

        console.log('DESERIALIZE: ' , id);

        try{

            let user = await User.findById(id);

            done(null , user);

        }//try
        catch(ex){
            done(ex);
        }//catch

    });

    passport.use(new LocalStrategy(
        {
            usernameField: 'login',    // req.body.login
            passwordField: 'password'  // req.body.password
        },

        async function(login, password, done) {

            try{

                let user = await User.findOne({ login: login });

                if(!user){
                    return done(null, false);
                }//if

                // let checkPassword = await user.verifyPassword( password );
                //
                // if( !checkPassword ){
                //     return done(null , false);
                // }//if

                done(null, user);

            }//try
            catch(ex){
                return done(ex);
            }//catch

        }// async fd

    ));

};