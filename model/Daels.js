'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dealsSchema = new Schema({

    sellerUser:{
        type: Schema.Types.ObjectId,
        ref:'user'
    },

    customerUser:{
        type: Schema.Types.ObjectId,
        ref:'user'
    },
    lot:{
        type: Schema.Types.ObjectId,
        ref:'lots'
    },
    dataDeals:{
        type: Number,
    },
    dealsStatus:{
        type: Schema.Types.ObjectId,
        ref:'dealsStatus'
    },
    evaluation:{
        type: Schema.Types.ObjectId,
        ref:'dealsEvalutions'
    }

});

module.exports = mongoose.model('deals' , dealsSchema);