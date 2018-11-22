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
    //теккущая ставка
    currentRate:{
        type: Number,
        validate:{
            validator: ( rate )=>{
                return rate >= ValidatorConstants.LOT_RATE;
            },//validator
            message: props => `Текущая ставка задана неверно: "${props.value}"`
        },
    },
//длительность торгов
    countHourTrade:{
        type:Number,
        validate:{
            validator: ( hour )=>{
                return hour >= ValidatorConstants.LOT_COUNTHOUR_VALIDATOR;
            },//validator
            message: props => `Количество часов продления торгов задано неверно : "${props.value}"`
        },
    },
    dateAdminAnswer:{
        type: Number,
        validate:{
            validator: ( date )=>{
                return date >= ValidatorConstants.LOT_DATE_VALIDATOR;
            },//validator
            message: props => `Дата указана нервно : "${props.value}"`
        },
    },

    datePlacement:{
        type: Number,
        validate:{
            validator: ( date )=>{
                return date >= ValidatorConstants.LOT_DATE_VALIDATOR;
            },//validator
            message: props => `Дата указана нервно : "${props.value}"`
        },
    },

    dateStartTrade:{
        type: Number,
        validate:{
            validator: ( date )=>{
                return date >= ValidatorConstants.LOT_DATE_VALIDATOR;
            },//validator
            message: props => `Дата указана нервно : "${props.value}"`
        },
    },

    dateEndTrade:{
        type: Number,
        validate:{
            validator: ( date )=>{
                return date >= ValidatorConstants.LOT_DATE_VALIDATOR;
            },//validator
            message: props => `Дата указана нервно : "${props.value}"`
        },
    },

    typeLot:{
        type: Number,
    },

    statusLot:{
        type: Number
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
