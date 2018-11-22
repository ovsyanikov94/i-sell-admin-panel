"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lots = require('./Lot');

const lotStatusSchema = new Schema({


    statusTitle: {
        type: String,
        validate:{
            validator: ( title )=>{
                return /^[a-zа-я0-9\s]{1,20}$/i.test( title )
            },//validator
            message: props => `Статус лота введен не корректно: "${props.value}"`
        },
    },
    statusID: Number,
    lots: [
        {
            type: Schema.Types.ObjectId,
            ref: 'lots'
        }
    ]
});
let id = lotStatusSchema.virtual('id');

id.get(function (  ) {
    return this._id;
});

module.exports = mongoose.model('lotStatuses' , lotStatusSchema);
