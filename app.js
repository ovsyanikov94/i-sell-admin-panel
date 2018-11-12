"use strict";

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const connection = require('./model/connection');

const app = express();

const categoryRoutes = require('./routes/categories');
const lotRoutes = require('./routes/lots');
const dealRouter = require('./routes/deals');
const statusDealRouter = require('./routes/statusDeal');
const statusUserRouter = require('./routes/statusUsers');
const subscribersRouter = require('./routes/subscribers');
const blackListRoutr = require('./routes/blackList');
const blockListRoutr = require('./routes/blockList');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', categoryRoutes);
app.use('/api', lotRoutes);
app.use('/api', dealRouter);
app.use('/api', statusDealRouter);
app.use('/api', statusUserRouter);
app.use('/api', subscribersRouter);
app.use('/api', blackListRoutr);
app.use('/api', blockListRoutr);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
