"use strict";

const gulp = require('gulp');
const gulpSync = require('gulp-sync')(gulp);

const connection = require('./model/connection');

//Очистка статусов сделок
require('./tasks/clear-deal-statuses');

//Вставка статусов сделок
require('./tasks/insert-deal-statuses');

//Очистка типов лотов
require('./tasks/clear-lot-type');

//Вставка типа лота
require('./tasks/insert-lot-type');

//Очистка статусов лотов
require('./tasks/clear-lot-statuses');

//Вставка статусов лотов
require('./tasks/insert-lot-statuses');

gulp.task( 'default' , gulpSync.sync([
    'clearDealStatuses',
    'InsertDefaultDealStatuses',
    //'clearLotType',
    //'InsertLotType',
    //'clearLotStatuses',
    //'InsertDefaultLotStatuses',
]));
