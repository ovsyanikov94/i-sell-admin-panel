"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
        type: String,
        validate:{
            validator: ( title )=>{
                return /^[a-zа-я0-9]{1,50}$/i.test( title )
            },//validator
            message: props => `Название категории не корректно: "${props.value}"`
        },
    },
    lots: [ {
        type: Schema.Types.ObjectId,
        ref: 'lots'
    } ]
});

module.exports = mongoose.model('categories' , categorySchema);
