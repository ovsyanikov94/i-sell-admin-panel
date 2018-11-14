'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constValidator = require('./Validation');

const dealsEvalutionSchema = new Schema({

    EvaluationText:{
        type: String,
        validate:{
            validator:(title)=>{
                return constValidator.STATUS_EVALUATION_TEXT_VALIDATOR.test(title)
            },
            message: props => `Комментарий содержит недопустимые символы: "${props.value}"`
        }
    },
    EvaluationValue:{
        type: Number,
        validate:{
            validator:(number)=>{
                return constValidator.STATUS_EVALUATION_VALUE_VALIDATOR.test(number)
            },
            message: props => `ценка содержит недопустимые символы: "${props.value}"`
        }
    },
    deals:{
        type: Schema.Types.ObjectId,
        ref:'deals'
    }
});

module.exports = mongoose.model('dealsEvalutions' , dealsEvalutionSchema);