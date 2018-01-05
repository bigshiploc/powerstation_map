var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// var index = require('./routes/index');
var GetData = require('./routes/get_data');
var map_3d_171 = require('./routes/171_3dmap');
var map_3d = require('./routes/3d_map');

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
app.use('/3d', map_3d_171);
app.use('/', map_3d);


//获取数据并发送数据

var getData = new GetData();

getAndSendData();

function getAndSendData() {
	console.log('函数的入口');
	getData.getAllData(function (data) {
		// console.log(new Date() + '----1-----' + data);
		getData.fayeSendDdata(data);
	});
	
	setInterval(function () {
		getData.getAllData(function (data) {
			// console.log(new Date() + '----2----' + data);
			getData.clearFunction();
			getData.fayeSendDdata(data);
		});
	}, 20 * 1000);
}


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
