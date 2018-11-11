"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categories = require('./Category');

const lotSchema = new Schema({
    lotTitle: {
        type: String,
        validate:{
            validator: ( title )=>{
                return /^[a-zа-я0-9\s]{1,100}$/i.test( title )
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
        minlength: 10,
        maxlength:500
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
                return price >= 0;
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
                return rate >= 0;
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
        type: Schema.Types.ObjectId,
        ref: 'lotTypes'
    },

    statusLot:{
        type: Schema.Types.ObjectId,
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
