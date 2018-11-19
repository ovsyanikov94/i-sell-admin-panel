"use strict";

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/I-SELL' , {
    useNewUrlParser: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connection success!');
});
//
// mongoose.set('debug', function(coll, method, query, doc, options) {
//
//     let set = {
//         coll: coll,
//         method: method,
//         query: query,
//         doc: doc,
//         options: options
//     };
//
//     console.log('query - details: ' , set);
//
// });

module.exports = mongoose;

