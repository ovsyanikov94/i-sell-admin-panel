"use strict";


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/I-SELL');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connection success!');
});

module.exports = mongoose; 

