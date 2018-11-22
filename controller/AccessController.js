"use strict";


module.exports.CheckAccess = async function ( req , res , next ) {

    if( req.isAuthenticated() ){
        console.log('session', req.session.passport.user);
        next();
    }//if
    else{
        res.redirect('/i-sell-admin-api/api/access-denied');
    }//else

};