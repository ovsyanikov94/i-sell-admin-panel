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

//Очистка типов лотов
require('./tasks/clear-lot-type');

//Вставка типа лота
require('./tasks/insert-lot-type');

//Очистка статусов лотов
require('./tasks/clear-lot-statuses');

//Вставка статусов лотов
require('./tasks/insert-lot-statuses');

//Вставка типов комментария
require('./tasks/insert-comment-statuses');

//Вставка статусов комментария
require('./tasks/insert-comment-types');

//Очистка статусов комментария
require('./tasks/clear-comment-statuses');

//Очистка типов комментария
require('./tasks/clear-comment-types');

gulp.task( 'default' , gulpSync.sync([
    // 'clearDealStatuses',
    // 'InsertDefaultDealStatuses',
    // 'clearUserStatuses',
    // 'InsertDefaultUserStatuses',
    // 'clearUserRoles',
    // 'InsertDefaultUserRoles',
    // 'clearLotType',
    // 'InsertLotType',
    // 'clearLotStatuses',
    // 'InsertDefaultLotStatuses',
     'InsertDefaultCommentStatuses',
     'InsertDefaultCommentTypes',
    // 'clearCommentStatuses',
    // 'clearCommentTypes',

]));