"use strict";


module.exports.MakeMongooseMessageFromError = ( mongooseError )=> {

    let keys = Object.keys(mongooseError.errors);
    let key = keys[0];

    let message = mongooseError.errors[key].message;

    return message;

};