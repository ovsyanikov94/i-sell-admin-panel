"use strict";


module.exports.CheckAccess = async function ( req , res , next ) {

    if( req.isAuthenticated() ){
        next();
    }//if
    else{
        res.redirect('/api/access-denied');
    }//else

};