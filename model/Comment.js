"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentStatus = require('./CommentStatus');
const commentType = require('./CommentType');
const users = require('./User');
const lots = require('./Lot');

const commentSchema = new Schema({
    commentText: {
        type: String,
        required: [true, 'Комментарий обязатален'],
        minLength: 5,
        maxLength: 500
    },

    commentStatus:{
        type: Schema.Types.ObjectId,
        ref: 'commentStatus'
    },

    commentType:{
        type: Schema.Types.ObjectId,
        ref: 'commentType'
    },

    commentSendDate:{
        type:Date
    },

    userSender:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    userReceiver:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    lot:{
        type: Schema.Types.ObjectId,
        ref: 'lots'
    }

});

module.exports = mongoose.model('comments' , commentSchema);
