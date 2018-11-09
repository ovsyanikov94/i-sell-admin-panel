"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    id: Schema.ObjectId,
    title: String,
    // lots: [ {
    //     id: Schema.ObjectId,
    //     ref: 'lots'
    // } ]
});

const lotSchema = new Schema({

    id: Schema.ObjectId,
    title:  String,
    categories: [ {
        id: Schema.ObjectId,
        ref: 'categories'
    } ]
});


module.exports.Category = mongoose.model('categories' , categorySchema);
module.exports.Lot = mongoose.model('lots' , lotSchema);

