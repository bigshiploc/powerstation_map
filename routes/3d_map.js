var express = require('express');
var router = express.Router();

var path = require('path');
var http = require('http');

var faye = require('faye');


router.get('/', function (req, res, next) {
	res.render(path.join(__dirname, '../public/html', '3d_map.html'));
	console.log('开始进入地图页面');
	// getTerminalData();// 调用终端位置接口，获取终端位置信息。
	// getAbnormalData();// 调用设备缺陷/异常接口，获取设备异常信息。
	
	fayeSendDdata();//用faye向前端发送数据。
	
});

var a = {
    "data": [
        {
            "sbms": "设备描述1",
            "qyms": "区域描述1",
            "rwxtm": "任务系统码1",
            "yhxtm": "6268de6841da4256bddd16e01e5ba55f_用户系统码1",
            "rwms": "任务描述1",
            "xmms": "项目描述1",
            "name": "超级管理员1",
            "mac": "0C-9F-9E-DC-9A-62",
            "piont": "45.547664293984795,126.66702098161626",
            "dlm": "sysadmin_登录名1",
            "deptname": "部门名称1",
            "mapName": "化水车间_终端所在区域名称1"
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
            "piont": "45.547664293984795,126.66702098161626",
            "dlm": "sysadmin_登录名2",
            "deptname": "部门名称2",
            "mapName": "化水车间_终端所在区域名称2"
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
            "piont": "45.547664293984795,126.66702098161626",
            "dlm": "sysadmin_登录名3",
            "deptname": "部门名称3",
            "mapName": "化水车间_终端所在区域名称3"
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
            "piont": "45.547664293984795,126.66702098161626",
            "dlm": "sysadmin_登录名4",
            "deptname": "部门名称4",
            "mapName": "化水车间_终端所在区域名称4"
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
            "piont": "45.547664293984795,126.66702098161626",
            "dlm": "sysadmin_登录名5",
            "deptname": "部门名称5",
            "mapName": "化水车间_终端所在区域名称5"
        },
    ]
}

// faye向前端发送数据
function fayeSendDdata() {
	var client = new faye.Client('http://localhost:3000/faye');
	
	// var msgNo = 1;
	setInterval(function() {
		for (i = 0; i < a.data.length; i++){
			client.publish('/data',JSON.stringify(a.data[i]));
			// msgNo++;
		}
	}, 2000);
}


// //调用另一个服务器API
// function getTerminalData() {
// 	console.log('------开始请求终端信息数据-------');
// 	http.get('http://www.chasingeda.com:7777/appsoft7/appservlet?requesttype=esightmapinfo', function (response) {
// 		response.on('data', function (result) {
// 			console.log('TerminalData:' + result)
// 		})
// 	})
// }
//
// function getAbnormalData() {
// 	console.log('-------开始请求缺陷/异常数据-------');
// 	http.get('http://www.chasingeda.com:7777/appsoft7/appservlet?requesttype=assetmapstatus&date=2017-12-12', function (response) {
// 		response.on('data', function (result) {
// 			console.log('TerminalData:' + result)
// 		})
// 	})
// }


module.exports = router;