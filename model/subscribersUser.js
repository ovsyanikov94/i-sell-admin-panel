"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscribersSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    MySubscribersList:[
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ],//MySubscribersListList список id людей на которых подписан пользователь
    MySubscriptionsList:[
        {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    ],//MySubscriptionsList список id людей  которые подписаны на пользователь

});

module.exports = mongoose.model('subscribers' , subscribersSchema);