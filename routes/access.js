"use strict";

const express = require('express');
const router = express.Router();

const passport = require('passport');

router.get('/access-denied' , (req , res )=>{

    res.status(401);
    res.send({
        code: 401,
        message: 'Доступ запрещен!',
        body: req.body
    });

});

router.get('/success' , (req , res )=>{

    res.status(200);
    res.send({
        code: 200,
        message: 'Доступ разрешен!'
    });

});

let settings = {

    successRedirect: '/api/success',
    failureRedirect: '/api/access-denied'

};

router.post('/auth', passport.authenticate('local' , {

    successRedirect: '/api/success',
    failureRedirect: '/api/access-denied',
    session: true

}) );

module.exports = router;