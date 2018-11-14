"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lots = require('./Lot');

const coordMapSchema = new Schema({
    lat: {
        type: Number,
        validate:{
            validator: ( lat )=>{
              return  lat >= 0
            },//validator
            message: props => `lat  должна быть больше 0: "${props.value}"`
        },
    },
    lon: {
        type: Number,
        validate:{
            validator: ( lon )=>{
              return  lon >= 0
            },//validator
            message: props => `lon  должна быть больше 0: "${props.value}"`
        },
    },


});

module.exports = mongoose.model('coordMaps' , coordMapSchema);
