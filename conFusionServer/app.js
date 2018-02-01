var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
var FilesStore = require("session-file-store")(session);

var index = require('./routes/index');
var users = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promotRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
mongoose.Promise = require("bluebird");

const url = "mongodb://localhost:27017/conFusion";
const connect = mongoose.connect(url, { userMongoClient: true});

connect.then(function(db) {
  console.log("Connected to server");
}, function(err) {
  console.log(err);
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser("12345-67890-AAAAA-BBBBB"));
app.use(session({
  name: "session-id",
  secret: "12345-67890-AAAAA-BBBBB",
  saveUninitialized: false,
  resave: false,
  store: new FilesStore()
}));

function auth(req, resp, next) {
  console.log(req.session);

  if (!req.session.user) {

    var authHeader = req.headers.authorization;
    if (!authHeader) {
      var err = new Error("You are not authenticated");
      resp.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    } 

    var auth = new Buffer(authHeader.split(" ")[1], "base64").toString().split(":");
    var username = auth[0];
    var password = auth[1];

    if (username === "admin" && password === "password") {
      req.session.user = "admin"; // Same here, "user" and "admin" are out inventions, can be anything
      next();
    } else {
      var err = new Error("Wrong user or password");
      resp.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
    // END of Session detected in request
  } else {
    if (req.session.user === "admin") {
      next();
    } else {
      // Found session, but wrong one.
      var err = new Error("You are not authenticated. Wrong session.");
      err.status = 401;
      return next(err);
    }
  } // END of found the cookie,good or bad.
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/dishes', dishRouter);
app.use('/promotions', promotRouter);
app.use('/leaders', leaderRouter);

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
