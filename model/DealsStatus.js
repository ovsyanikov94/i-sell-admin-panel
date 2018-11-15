'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const constValidator = require('./Validation');

/*

    [
        { id: "1;l42keqmwd;sax" , title: "Подтвержден" , descr: "" },
        { id: "flwefkkjweiofjkcm" , title: "Жалоба" },
    ]

 */

const dealsStatusSchema = new Schema({

    titleStatus:{
        type: String,
        validate:{
            validator:(title)=>{
                return constValidator.TITLE_VALIDATOR.test(title)
            },
            message: props => `Название статуса сделки не корректно: "${props.value}"`
        }
    },
    dealID: Number,
    deals:[{
        type: Schema.Types.ObjectId,
        ref:'deals'
    }]
});

module.exports = mongoose.model('dealsStatus' , dealsStatusSchema);