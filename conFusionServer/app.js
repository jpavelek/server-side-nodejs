var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
var FilesStore = require("session-file-store")(session);
var passport = require("passport");
var autheticate = require("./authenticate");
var config = require("./config");


var index = require('./routes/index');
var users = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promotRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');
mongoose.Promise = require("bluebird");

const url = config.mongoUrl;
const connect = mongoose.connect(url, { userMongoClient: true});

connect.then(function(db) {
  console.log("Connected to server");
}, function(err) {
  console.log(err);
})

var app = express();

app.all("*", function(req, resp, next) {
  if (req.secure) {
    next();
  } else {
    resp.redirect(307, "https://" + req.hostname + ":" + app.get("secPort") + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', index);
app.use('/users', users);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promotions', promotRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
