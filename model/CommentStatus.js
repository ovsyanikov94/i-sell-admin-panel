"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentStatusSchema = new Schema({
    commentStatusTitle: {
        type: String,
    },

});

module.exports = mongoose.model('commentStatus' , commentStatusSchema);
