"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constValidator = require('./Validation');

const biddingSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    rate: {
        type: Number,
        validate:{
            validator: ( rate )=>{
                return rate > constValidator.LOT_RATE;
            },
            message: props => `Ставка должна быть больше нуля \n"${props.value}"`
        },
    },
    dateRate: {
        type: Number,
        validate:{
            validator: ( date )=>{
                return date >= constValidator.LOT_DATE_VALIDATOR;
            },//validator
            message: props => `Дата указана нервно : "${props.value}"`
        },
    },


});

module.exports = mongoose.model('biddings' , biddingSchema);