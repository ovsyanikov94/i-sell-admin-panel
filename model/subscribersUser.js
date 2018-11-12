"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscribersSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    blackList:[
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ]
});

module.exports = mongoose.model('subscribers' , subscribersSchema);