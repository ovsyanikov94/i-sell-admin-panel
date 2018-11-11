"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentTypeSchema = new Schema({
    commentTypeTitle: {
        type: String,
    },

});

module.exports = mongoose.model('commentType' , commentTypeSchema);
