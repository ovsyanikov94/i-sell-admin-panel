"use strict";

const passport = require('passport');

const AccessController = require('../controller/User/AccessController');

const express = require('express');
const router = express.Router();

const Options = {
    // `${host:port}${successRedirect}
    successRedirect: '/i-sell-admin-api/api/success',
    failureRedirect: '/i-sell-admin-api/api/access-denied',
    failureFlash: false

};

router.get('/success' , function ( req, res ) {

    res.status(200);
    
    res.send({
        status: 200,
        message: 'Доступ разрешен'
    });

});

router.get('/access-denied' , function ( req , res ) {


    res.status(401);

    res.send({
        status: 401,
        message: 'Доступ запрещен!'
    });

});

router.post('/auth-user' , passport.authenticate('local' , Options ) );;

router.get('/check-admin-access' , AccessController.isAuth );

module.exports = router; 