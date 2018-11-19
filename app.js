"use strict";

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

const connection = require('./model/connection');

const app = express();


const userRouter = require('./routes/user');
const categoryRoutes = require('./routes/categories');
const lotRoutes = require('./routes/lots');
const lotStatusRoutes = require('./routes/lotStatus');
const lotTypeRoutes = require('./routes/lotType');
const dealRouter = require('./routes/deals');
const statusDealRouter = require('./routes/statusDeal');
const statusUserRouter = require('./routes/statusUsers');
const subscribersRouter = require('./routes/subscribers');
const blackListRouter = require('./routes/blackList');
const blockListRouter = require('./routes/blockList');
const commentRouter = require('./routes/comment');
const commentTypeRouter = require('./routes/commentType');
const commentStatusRouter = require('./routes/commentStatus');

//access routes
const accessRoutes = require('./routes/access');

const LocalStrategy = require('./passport/LocalStrategy');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')(
    {
        secret:'elkflwekflwekfl888ef',
        saveUninitialized: true,
        cookie: {
            maxAge: (1000 * 60 ) * 60, // ms
            secure: false
        },
    }
));

app.use(passport.initialize());
app.use(passport.session());

LocalStrategy(passport);

app.use('/api' , accessRoutes);
app.use('/api',userRouter);
app.use('/api', categoryRoutes);
app.use('/api', lotRoutes);
app.use('/api', lotStatusRoutes);
app.use('/api', lotTypeRoutes);

app.use('/api', dealRouter);
app.use('/api', statusDealRouter);
app.use('/api', statusUserRouter);
app.use('/api', subscribersRouter);
app.use('/api', blackListRouter);
app.use('/api', blockListRouter);

app.use('/api', commentRouter);
app.use('/api', commentStatusRouter);
app.use('/api', commentTypeRouter);

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
