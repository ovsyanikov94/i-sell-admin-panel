"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({

    id: Schema.Types.ObjectId,
    title: String,
    lotsArray: [ {
        type: Schema.Types.ObjectId,
        ref: 'lots'
    } ]

});

const lotSchema = new Schema({

    id: Schema.Types.ObjectId,
    title:  String,
    categoriesArray: [ {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    } ]
});

module.exports.Category = mongoose.model('lots' , lotSchema);
module.exports.Lot = mongoose.model('categories' , categorySchema);

