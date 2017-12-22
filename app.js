var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var map_2d_171 = require('./routes/171map');
var map_3d_171 = require('./routes/171_3dmap');
var map_3d = require('./routes/3d_map');
var map_2d = require('./routes/2d_map');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/'));
// app.set('view engine', 'ejs');

app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
app.use('/users', users);
app.use('/2d', map_2d_171);
app.use('/3d', map_3d_171);
app.use('/map_3d', map_3d);
app.use('/map_2d', map_2d);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
