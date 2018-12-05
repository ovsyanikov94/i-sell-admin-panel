"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constValidator = require('./Validation');
const bcrypt = require('bcrypt');

const adminSchema = new Schema({

    userBase: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    approvedLot: [{
        type: Schema.Types.ObjectId,
        ref: 'lots'
    }],
    rejectedLot: [{
        type: Schema.Types.ObjectId,
        ref: 'lots'
    }],
    blockList:[{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],


});


module.exports = mongoose.model('admins' , adminSchema);