"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lots = require('./Lot');

const userSchema = new Schema({
    firstName: {
        type: String,
        validate:{
            validator: ( name )=>{
                return /^[a-zа-я0-9]{1,20}$/i.test( name )
            },//validator
            message: props => `Имя введенно не корректно: "${props.value}"`
        },
    },

    lots: [
        {
            type: Schema.Types.ObjectId,
            ref: 'lots'
        }
    ]
});

module.exports = mongoose.model('users' , userSchema);
