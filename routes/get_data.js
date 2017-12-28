var http = require('http');
var faye = require('faye');


function GetData() {
	
	this.getTerminalData = function () {
		console.log('------开始请求终端信息数据-------');
		http.get('http://www.chasingeda.com:7777/appsoft7/appservlet?requesttype=esightmapinfo', function (response) {
			response.on('data', function (result) {
				console.log('TerminalData:' + result)
			})
		})
	};
	
	this.getAbnormalData = function () {
		console.log('-------开始请求缺陷/异常数据-------');
		http.get('http://www.chasingeda.com:7777/appsoft7/appservlet?requesttype=assetmapstatus&date=2017-12-12', function (response) {
			response.on('data', function (result) {
				console.log('TerminalData:' + result)
			})
		})
	};
	
	this.fayeSendDdata = function (a) {
		var client = new faye.Client('http://localhost:3000/faye');
		
		// var msgNo = 0;
		setInterval(function() {
			for (i = 0; i < a.data.length; i++){
				client.publish('/data',a.data[i]);
				console.log(a.data[i])
				// msgNo++;
			}
		}, 5000);
	}
}

module.exports = GetData;