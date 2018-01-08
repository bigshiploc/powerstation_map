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
			
			var dataArr = [];
			
			response.on('data', function (result) {
				dataArr.push(result.toString());
			});
			
			response.on('end', function () {
				var terminalData = '';
				for (var i = 0; i < dataArr.length; i++) {
					terminalData += dataArr[i];
				}
				var terminalData1 = JSON.parse(terminalData);
				try {
					for (var i = 0; i < terminalData1.data.length; i++) {
						if (terminalData1.data.length != 0 && terminalData1.data[i].mapName in dataName) {
							terminalData1.data[i].mapName = dataName[terminalData1.data[i].mapName]
						}
					}
					
					data.terminalData = terminalData1;
					
				} catch (err) {
					console.log('--获取终端位置信息的API发生错误--' + err)
				}
			});
			
			
			http.get('http://www.chasingeda.com:7777/appsoft7/appservlet?requesttype=assetmapstatus&date=2017-12-12', function (response) {
				response.on('data', function (result) {
					
					data.abnormalData = JSON.parse(result.toString());
					cb(data)
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

module.exports = GetData;