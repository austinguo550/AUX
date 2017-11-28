var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var spotify = require('./routes/spotify');
var login = require('./routes/login');
var mongo = require('./routes/mongo');

const mongoose = require('mongoose');

var app = express();

var Room = require('./models/room');
mongoose.connect('mongodb://localhost/test');
mongoose.connection
  .once('open', function () {
    console.log('Mongoose successfully connected to Mongo')
  })
  .on('error', function (error) {
    console.error('Mongoose/ Mongo connection error:', error)
  })

/*
Mongoose code
*/
// const mongoose = require('mongoose');

// // ES6 Promises
// mongoose.Promise = global.Promise;

// // connect to mongodb
// var db = mongoose.createConnection('localhost', 'test');
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// guarantee connection to the db before performing any action


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/spotify', spotify);
app.use('/login', login.loginRoute);
app.use('/callback', login.callbackRoute);
app.use('/mongo/addSong', mongo.addSong);
app.use('/mongo/createRoom', mongo.createRoom);

// setup directory to grab cookies
app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

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
