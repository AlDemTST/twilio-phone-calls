var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
global.XMLHttpRequest = require('xhr2');
global.WebSocket = require('ws');
// const directline = require('offline-directline');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var outboundCallsRouter = require('./routes/outboundCalls');
var inboundCallsRouter = require('./routes/inboundCalls');

var app = express();

// directline.initializeRoutes(app, 4000, "http://127.0.0.1:3978/api/messages/conversations");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/outbound-call', outboundCallsRouter);
app.use('/inbound-call', inboundCallsRouter);

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
