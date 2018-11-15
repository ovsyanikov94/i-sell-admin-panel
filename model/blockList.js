"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockListSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    List:[
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ]
});

module.exports = mongoose.model('blockList' , blockListSchema);