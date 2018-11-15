"use strict";

const gulp = require('gulp');
const gulpSync = require('gulp-sync')(gulp);

const connection = require('./model/connection');

//Очистка статусов сделок
require('./tasks/clear-deal-statuses');

//Вставка статусов сделок
require('./tasks/insert-deal-statuses');

//LOT
require('./tasks/clear-lot-statuses');
require('./tasks/insert-lot-statuses');
require('./tasks/clear-lot-types');
require('./tasks/insert-lot-types');

gulp.task( 'default' , gulpSync.sync([
    // 'clearDealStatuses',
    // 'InsertDefaultDealStatuses',

    // 'clearLotStatuses',
    // 'InsertDefaultLotStatuses',
    'clearLotTypes',
    'InsertDefaultLotTypes'
]));