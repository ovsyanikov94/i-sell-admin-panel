"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constValidator = require('./Validation');

const commentStatusSchema = new Schema({

    commentStatusTitle: {
        type: String,
        validate:{
            validator:(commentStatusTitle)=>{
                return constValidator.TITLE_VALIDATOR.test(commentStatusTitle)
            },
            message: props => `Название статуса комментария некорректно: "${props.value}"`
        }
    },
    commentStatusID: {
        type:Number
    }

});

module.exports = mongoose.model('commentStatus' , commentStatusSchema);
