var createError = require('http-errors');
var http = require('http');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// const Vonage = require('@vonage/server-sdk')

// const vonage = new Vonage({
//   apiKey: "4b4c9cc5",
//   apiSecret: "OGvs4ltJiHgLlAc7"
// })
var app = express();

app.use(cors())



let mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'newuser',
  port:3306,
  password: 'newpassword',
  database: 'food_delivery'
});

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  } else{
  console.log('Connected to the MySQL server.');
  }
});

// view engine setup
app.use('/images/', express.static(path.join(__dirname, './views/images')));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

http.createServer(app).listen(app.get('port'),
  function(){
    console.log("Express server listening on port " + app.get('port'));
});

app.set('port', process.env.PORT || 3000);

module.exports = app;