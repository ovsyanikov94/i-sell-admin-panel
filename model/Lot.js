"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categories = require('./Category');

const lotSchema = new Schema({
    title:  String,
    categories: [
        categories.Model
    ]
});

module.exports = {
  Model: mongoose.model('lots' , lotSchema),
  Schema:   lotSchema
}
