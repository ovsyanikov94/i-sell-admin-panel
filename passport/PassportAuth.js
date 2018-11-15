"use strict";

const User = require('../model/User');
const LocalStrategy = require('passport-local').Strategy;

module.exports = ( passport )=> {

    passport.serializeUser(function(user, done) {

        console.log('serializeUser: ' , user);
        done(null, user._id);

    });

    passport.deserializeUser(function(id, done) {

        console.log('deserializeUser: ' , id);

        User.findById(id, function(err, user) {
            done(err, user);
        });

    });

    passport.use( new LocalStrategy(
        {
            usernameField: 'login',
            passwordField: 'password'
        },
        async function ( login , password , done ) {

            console.log('ARGS: ' , arguments );

            let user = await User.findOne({ login: login });

            if (!user) { return done(null, false); }

            return done(null, user);


        } )
    );
};
