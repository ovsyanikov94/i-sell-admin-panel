"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constValidator = require('./Validation');

const commentTypeSchema = new Schema({

    commentTypeTitle: {
        type: String,
        validate:{
            validator:(commentTypeTitle)=>{
                return constValidator.COMMENT_STATUS_AND_TYPE_VALIDATOR.test(commentTypeTitle)
            },
            message: props => `Название типа комментария некорректно: "${props.value}"`
        }
    },
    commentTypeID:{
        type:Number
    }

});

module.exports = mongoose.model('commentType' , commentTypeSchema);
