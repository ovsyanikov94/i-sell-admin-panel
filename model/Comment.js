"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lots = require('./Lot');

const commentSchema = new Schema({
    title: {
        type: String,
    },

});

module.exports = mongoose.model('comments' , commentSchema);
