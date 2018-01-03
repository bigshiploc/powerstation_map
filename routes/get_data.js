var http = require('http');
var faye = require('faye');


function GetData() {
	
	var data = {};
	var sendData;
	
	this.getData = function (cb) {
		console.log('------开始请求api数据-------');
		http.get('http://www.chasingeda.com:7777/appsoft7/appservlet?requesttype=esightmapinfo', function (response) {
			response.on('data', function (result) {
				
				data.terminalData = result.toString();
				
				http.get('http://www.chasingeda.com:7777/appsoft7/appservlet?requesttype=assetmapstatus&date=2017-12-12', function (response) {
					response.on('data', function (result) {
						// console.log('AbnormalData' + result)
						// console.log('wangyongfei')
						data.abnormalData = result.toString();
						cb(data)
					})
				})
			})
		})
	};
	
	
	this.fayeSendDdata = function (a) {
		var client = new faye.Client('http://localhost:3000/faye');
		
		sendData = setInterval(function () {
			client.publish('/data', a);
		}, 5000);
	}
	
	this.clearFunction = function () {
		clearInterval(sendData)
	}
}

module.exports = GetData;