var http = require('http');
var faye = require('faye');


function GetData() {
	
	var data = {};
	var sendData;
	
	var dataName = {
		'化水车间': 'huashuichejian'
	};
	
	this.getAllData = function (cb) {
		console.log('------开始请求api数据-------');
		http.get('http://www.chasingeda.com:7777/appsoft7/appservlet?requesttype=esightmapinfo', function (response) {
			response.on('data', function (result) {
				
				try {
					var terminalData = JSON.parse(result.toString());
					
					for (var i = 0; i < terminalData.data.length; i++) {
						if (terminalData.data.length != 0 && terminalData.data[i].mapName in dataName) {
							terminalData.data[i].mapName = dataName[terminalData.data[i].mapName]
						}
					}

					data.terminalData = terminalData;
					
					// console.log(JSON.stringify(data))
					
				} catch (err) {
					console.log('--获取终端位置信息的API发生错误--' + err)
				}
				
				http.get('http://www.chasingeda.com:7777/appsoft7/appservlet?requesttype=assetmapstatus&date=2017-12-12', function (response) {
					response.on('data', function (result) {

						data.abnormalData = JSON.parse(result.toString());
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
	};
	
	this.clearFunction = function () {
		clearInterval(sendData);
	};
}

module.exports = GetData;