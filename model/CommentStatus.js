"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constValidator = require('./Validation');

const commentStatusSchema = new Schema({

    commentStatusTitle: {
        type: String,
        validate:{
            validator:(commentStatusTitle)=>{
                return constValidator.COMMENT_STATUS_AND_TYPE_VALIDATOR.test(commentStatusTitle)
            },
            message: props => `Название статуса комментария некорректно: "${props.value}"`
        }
    },

});

module.exports = mongoose.model('commentStatus' , commentStatusSchema);
