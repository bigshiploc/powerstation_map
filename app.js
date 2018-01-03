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


//获取服务器数据
var getData = new GetData();

getData.getTerminalData();
getData.getAbnormalData();


//假数据
var a = {
    "data": [
        {
            "point": "45.54874467894849,126.66897572224606",
            "qyms": "设备间",
            "sbms": "1号纤维过滤器",
            "rwxtm": "20a563b0078a471a9da84b9489ddc0b4",
            "yhxtm": "88877343940840b1867b54a342b8458d",
            "rwms": "1月3日7时30分化学接班检查",
            "name": "贾凤荣",
            "xmms": "1号纤维过滤器是否泄漏",
            "mac": "AC-6C-3B-03-68-F3",
            "dlm": "jiafr",
            "deptname": "运行部",
            "mapName": "化水车间"
        },
        {
            "sbms": "设备描述1",
            "qyms": "区域描述1",
            "rwxtm": "任务系统码1",
            "yhxtm": "6268de6841da4256bddd16e01e5ba55f_用户系统码1",
            "rwms": "任务描述1",
            "xmms": "项目描述1",
            "name": "超级管理员1",
            "mac": "0C-9F-9E-DC-9A-62",
            "point": "45.5637664293984795,126.69782198161626",
            "dlm": "sysadmin_登录名1",
            "deptname": "部门名称1",
            "mapName": "化水车间-1"
        },
        {
            "sbms": "设备描述2",
            "qyms": "区域描述2",
            "rwxtm": "任务系统码2",
            "yhxtm": "6268de6841da4256bddd16e01e5ba55f_用户系统码2",
            "rwms": "任务描述2",
            "xmms": "项目描述2",
            "name": "超级管理员2",
            "mac": "0C-9F-9E-DC-9A-62",
            "point": "45.5467664293984795,126.666451098161626",
            "dlm": "sysadmin_登录名2",
            "deptname": "部门名称2",
            "mapName": "化水车间-2"
        },
        {
            "sbms": "设备描述3",
            "qyms": "区域描述3",
            "rwxtm": "任务系统码3",
            "yhxtm": "6268de6841da4256bddd16e01e5ba55f_用户系统码3",
            "rwms": "任务描述3",
            "xmms": "项目描述3",
            "name": "超级管理员3",
            "mac": "0C-9F-9E-DC-9A-62",
            "point": "45.5569864293984795,126.66569098161626",
            "dlm": "sysadmin_登录名3",
            "deptname": "部门名称3",
            "mapName": "化水车间-3"
        },
        {
            "sbms": "设备描述4",
            "qyms": "区域描述4",
            "rwxtm": "任务系统码4",
            "yhxtm": "6268de6841da4256bddd16e01e5ba55f_用户系统码4",
            "rwms": "任务描述4",
            "xmms": "项目描述4",
            "name": "超级管理员4",
            "mac": "0C-9F-9E-DC-9A-62",
            "point": "45.596564293984795,126.632902098161626",
            "dlm": "sysadmin_登录名4",
            "deptname": "部门名称4",
            "mapName": "化水车间-4"
        },
        {
            "sbms": "设备描述5",
            "qyms": "区域描述5",
            "rwxtm": "任务系统码5",
            "yhxtm": "6268de6841da4256bddd16e01e5ba55f_用户系统码5",
            "rwms": "任务描述5",
            "xmms": "项目描述5",
            "name": "超级管理员5",
            "mac": "0C-9F-9E-DC-9A-62",
            "point": "45.5562664293984795,126.667456098161626",
            "dlm": "sysadmin_登录名5",
            "deptname": "部门名称5",
            "mapName": "化水车间-5"
        }
    ]
}
var dataName = {
    '化水车间': 'huashuichejian',
    '化水车间-1': 'huashuichejian-1',
    '化水车间-2': 'huashuichejian-2',
    '化水车间-3': 'huashuichejian-3',
    '化水车间-4': 'huashuichejian-4',
    '化水车间-5': 'huashuichejian-5'
};

for (var i = 0; i < a.data.length; i++) {
    a.data[i].mapName = dataName[a.data[i].mapName]
}
//向前端发送数据
getData.fayeSendDdata(a);


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
