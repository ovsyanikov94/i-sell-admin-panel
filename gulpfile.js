"use strict";

const gulp = require('gulp');
const gulpSync = require('gulp-sync')(gulp);

const connection = require('./model/connection');

//Очистка статусов сделок
require('./tasks/clear-deal-statuses');
//Вставка статусов сделок
require('./tasks/insert-deal-statuses');
//очистка роли юзера
require('./tasks/clear-user-role');
//добавление роли юзера
require('./tasks/insert-user-role')
//очистка статуса юзера
require('./tasks/clear-user-status');
//добавление статуса юзера
require('./tasks/insert-user-status')

gulp.task( 'default' , gulpSync.sync([
    'clearDealStatuses',
    'InsertDefaultDealStatuses',
    'clearUserStatuses',
    'InsertDefaultUserStatuses',
    'clearUserRoles',
    'InsertDefaultUserRoles',

]));