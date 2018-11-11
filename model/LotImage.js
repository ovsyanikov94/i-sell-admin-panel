"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lots = require('./Lot');

const lotImageSchema = new Schema({
    path: {
        type: String,
        required: [true, 'Путь к изображению лота обязательно']
    },

});

module.exports = mongoose.model('lotImages' , lotImageSchema);
