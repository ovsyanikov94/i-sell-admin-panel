"use strict";

const mongoose = required('mongoose');
const Schema = mongoose.Schema;

const user = required("./User");
const lot = required("./Lot");

//описание схемы модели оценки лота
const lotMarkSchema = new Schema({

   sender:{
     type: Schema.Types.ObjectId,
     ref: 'user'
   },//sender

   receiver:{
    type: Schema.Types.ObjectId,
    ref: 'lot'
   },//receiver

   mark:{
      type: Number,
      required: [true, 'Оценка обязательна'],
      validate:{
          validator: (mark)=>{
              return /^[0-1]+$/.test(mark)
          },//validator
      }//validate
   },//mark

});

//создание оценки лота в базе
module.exports = mongoose.model('lotMarks', lotMarkSchema );
