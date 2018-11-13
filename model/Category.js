"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ValidationConstants = require('./Validation');

const categorySchema = new Schema({
    id: Schema.ObjectId,
    title: {
        type: String,
        validate:{
            validator: ( title )=>{
                return ValidationConstants.TITLE_VALIDATOR.test( title )
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
