"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ValidationConstants = require('./Validation');

const markSchema = new Schema({

    markTitle: {
      type: String,
      required: [true, 'Название обязательно'],
      validate:{
          validator: ( title )=>{
              return ValidationConstants.TITLE_VALIDATOR.test( title )
          },//validator
          message: props => `Название оценки не корректно: "${props.value}"`
      },
    },

    markValue: {
        type: Number,
        required: [true, 'Значение оценки обязательно'],
        validate:{
            validator: (mark)=>{
                return /^[0-1]$/.test(mark)
            },//validator
            message: props => `Не коректное значение "${props.value}". Значение может быть только "0" или "1".`
        }//validate
    }

});

module.exports = mongoose.model( 'marks', markSchema );