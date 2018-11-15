"use strict";

module.exports.CheckAccess = async ( req , res , next )=>{

    if( req.isAuthenticated() ){
        next();
    }//if
    else{
        res.redirect('/access-denied');
    }//else

};