"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constValidator = require('./Validation');

const commentTypeSchema = new Schema({

    commentTypeTitle: {
        type: String,
        validate:{
            validator:(commentTypeTitle)=>{
                return constValidator.TITLE_VALIDATOR.test(commentTypeTitle)
            },
            message: props => `Название типа комментария некорректно: "${props.value}"`
        }
    },
    commentTypeID:{
        type:Number
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'comments'
        }
    ]

});

module.exports = mongoose.model('commenttypes' , commentTypeSchema);
