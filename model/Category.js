"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lots = require('./Lot');

const categorySchema = new Schema({
    id: Schema.ObjectId,
    title: String,
    lots: [ lots.Model ]
});

module.exports = {
    Model: mongoose.model('categories' , categorySchema),
    Schema: categorySchema
};
