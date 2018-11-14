"use strict";

const gulp = require('gulp');
const gulpSync = require('gulp-sync')(gulp);

const connection = require('./model/connection');

//Очистка статусов сделок
require('./tasks/clear-deal-statuses');

//Вставка статусов сделок
require('./tasks/insert-deal-statuses');

gulp.task( 'default' , gulpSync.sync([
    'clearDealStatuses',
    'InsertDefaultDealStatuses',
    'clearUserStatuses',
    'InsertDefaultUserStatuses',
    'clearUserRoles',
    'InsertDefaultUserRoles',

]));