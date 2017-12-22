var express = require('express');
var router = express.Router();

var path = require('path');
var http = require('http');


router.get('/', function (req, res, next) {
	res.render(path.join(__dirname, '../public/html', '171_3dmap.html'));
	console.log('开始进入地图页面');
	// getTerminalData();// 调用终端位置接口，获取终端位置信息。
	// getAbnormalData();// 调用设备缺陷/异常接口，获取设备异常信息。
	
});

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