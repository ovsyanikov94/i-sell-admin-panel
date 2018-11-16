"use strict";

const passport = require('passport');

const express = require('express');
const router = express.Router();

const Options = {
    // `${host:port}${successRedirect}
    successRedirect: '/api/success',
    failureRedirect: '/api/access-denied',
    failureFlash: false

};

router.get('/success' , function ( req, res ) {

    res.status(200);
    
    res.send({
        code: 200,
        message: 'Доступ разрешен',
        token: req.session.passport.user
    });

});

router.get('/access-denied' , function ( req , res ) {

    res.status(401);

    res.send({
        code: 401,
        message: 'Доступ запрещен!'
    });

});

router.post('/auth-user' , passport.authenticate('local' , Options ) );


module.exports = router; 