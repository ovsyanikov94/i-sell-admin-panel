"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categories = require('./Category');

const lotSchema = new Schema({
    title: {
        type: String,
        validate:{
            validator: ( title )=>{
                return /^[a-zа-я0-9\s]{1,100}$/i.test( title )
            },//validator
            message: props => `Название лота не корректно: "${props.value}"`
        },
    },
    startPrice: {
        type: Number,
        validate:{
            validator: ( price )=>{
                return price >= 0;
            },//validator
            message: props => `Начальная цена задана неверно: "${props.value}"`
        },
    },
    categories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'categories'
        }
    ]
});

module.exports = mongoose.model('lots' , lotSchema);
