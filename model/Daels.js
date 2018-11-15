'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DealStatus = require('./DealsStatus');

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
    dateDeals:{
        type: Number,
    },
    dealsStatus:{
        type: Number,
    },
    evaluation:{
        type: Schema.Types.ObjectId,
        ref:'dealsEvalutions'
    }

});

let deal = dealsSchema.virtual('deal');

deal.get( async function (  ) {
    return await DealStatus.findOne({ dealID: this.dealsStatus }, 'titleStatus dealID');
} );

module.exports = mongoose.model('deals' , dealsSchema);