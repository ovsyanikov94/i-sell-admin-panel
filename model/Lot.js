"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categories = require('./Category');
const ValidatorConstants = require('../model/Validation');

const lotSchema = new Schema({
    lotTitle: {
        type: String,
        validate:{
            validator: ( title )=>{
                return ValidatorConstants.TITLE_VALIDATOR.test( title )
            },//validator
            message: props => `Название лота не корректно: "${props.value}"`
        },
    },
    customer:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    seller:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    lotDescription:{
        type: String,
        required: [true, 'Описание лота обязательно'],
        validate:{
            validator: ( lotDescription )=>{
                return ValidatorConstants.TEXT_VALIDATOR.test( lotDescription )
            },//validator
            message: props => `Название лота не корректно: "${props.value}"`
        },
    },

    lotImagePath:[
        {
        type: Schema.Types.ObjectId,
        ref: 'lotImages'
    }
    ],
    startPrice: {
        type: Number,
        validate:{
            validator: ( price )=>{
                return price >= ValidatorConstants.LOT_START_PRICE;
            },//validator
            message: props => `Начальная цена задана неверно: "${props.value}"`
        },
    },

    mapLot:{
        type: Schema.Types.ObjectId,
        ref: 'coordMaps'
    },
    currentRate:{
        type: Number,
        validate:{
            validator: ( rate )=>{
                return rate >= ValidatorConstants.LOT_RATE;
            },//validator
            message: props => `Рейтинг задан неверно: "${props.value}"`
        },
    },

    dateAdminAnswer:{
        type: Date,
    },

    datePlacement:{
        type: Date,
    },

    dateStartTrade:{
        type: Date,
    },

    dateEndTrade:{
        type: Date,
    },

    typeLot:{
        type: Number,
        ref: 'lotTypes'
    },

    statusLot:{
        type: Number,
        ref: 'lotStatuses'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comments'
        }
    ],
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'categories'
        }
    ]
});

module.exports = mongoose.model('lots' , lotSchema);
