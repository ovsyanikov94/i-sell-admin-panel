"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentStatus = require('./CommentStatus');
const commentType = require('./CommentType');
const users = require('./User');
const lots = require('./Lot');

const ValidatorConstants = require('../model/Validation');

const commentSchema = new Schema({
    commentText: {
        type: String,
        required: [true, 'Комментарий обязатален'],
        minLength: 5,
        maxLength: 500
    },

    commentStatus:{
        type: Number,
        ref: 'commentStatus'
    },

    commentType:{
        type: Number,
        ref: 'commentType'
    },

    commentSendDate:{
        type:Number,
        validate:{
            validator: ( date )=>{
                return date >= ValidatorConstants.COMMENT_DATE_VALIDATOR;
            },//validator
            message: props => `Дата указана неверно : "${props.value}"`
        },
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
