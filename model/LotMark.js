"use strict";

const mongoose = required('mongoose');
const Schema = mongoose.Schema;

const user = required("./User");
const lot = required("./Lot");

//описание схемы модели оценки лота
const lotMarkSchema = new Schema({

   sender:{
     type: Schema.Types.ObjectId,
     ref: 'users'
   },//sender

   receiver:{
    type: Schema.Types.ObjectId,
    ref: 'lots'
   },//receiver

   mark:{
      type: Number,
      required: [true, 'Оценка обязательна'],
      validate:{
          validator: (mark)=>{
              return /^[0-1]+$/.test(mark)
          },//validator
          message: props => `Не коректное значение "${props.value}". Значение может быть только "0" или "1".`
      }//validate
   },//mark

});

//создание оценки лота в базе
module.exports = mongoose.model('lotMarks', lotMarkSchema );
