"use strict";

const RoleEnums = require('../model/Enums/UserRole');

module.exports.CheckAccess = async function ( req , res , next ) {

    if( req.isAuthenticated() ){
        console.log('session', req.session.passport.user);
        next();
    }//if
    else{
        res.redirect('/i-sell-admin-api/api/access-denied');
    }//else

};


module.exports.CheckAdminAccess = async function ( req , res , next ) {

    if( req.isAuthenticated() && req.session.passport.user.role.userRoleId === RoleEnums.ADMIN){
        console.log('session', req.session.passport.user);
        next();
    }//if
    else{
        res.redirect('/i-sell-admin-api/api/access-denied');
    }//else

};