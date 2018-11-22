"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lots = require('./Lot');

const lotTypeSchema = new Schema({
    typeTitle: {
        type: String,
        validate:{
            validator: ( title )=>{
                return /^[a-zа-я0-9\s]{1,20}$/i.test( title )
            },//validator
            message: props => `Тип лота введен не корректно: "${props.value}"`
        },
    },

    typeID: Number,
    lots: [
        {
            type: Schema.Types.ObjectId,
            ref: 'lots'
        }
    ]
});

module.exports = mongoose.model('lottypes' , lotTypeSchema);
