(function (window) {
	
    var result_callback = function (result) {
        console.log('===返回值result=== ' + JSON.stringify(result));
    };

    var fail_callback = function (e) {
        return console.error(e, e.stack);
    };

    var map = new NGR.map.Map({
        appKey: 'da706c00986c43c4ba63ed5d2c01993b',
        styleTemplate: '../stylesheets/template.json',
        floorControl: {
            enable: true
        }
    });

    var MAP_ID = 3209044;
    var BUG_DATA;
    var TERMINAL_DATA = [];
    var BUILDING_INFO;
    var ALL_OVERLAY = {};
    var ADD_OVERLAY;
    var FLOOR_CONTROL;
    var SET_SKEW;
    var SKEW_BUTTONS = document.getElementsByClassName('btn');
    var NUM = 0;
	
	var personnel_list = document.getElementById('personnel-list-tbody');
	
	//创建巡检人员列表的方法
	function getPersonnelList(personnel_list, dataArr) {
		if(personnel_list.childElementCount == 1){
			for (var j = 0; j < dataArr.length; j++) {
				var tr = document.createElement('tr');
				for (var i = 0; i < 3; i++) {
					var td = document.createElement('td');
					if (i == 0){
						var text = document.createTextNode(dataArr[j].name);
					}else if(i == 1){
						var text = document.createTextNode(dataArr[j].deptname);
					}else {
						var text = document.createTextNode(dataArr[j].point);
					}
					td.appendChild(text);
					tr.appendChild(td);
				}
				personnel_list.appendChild(tr);
			}
		}else {
			console.log('--这里执行更新列表的方法--');
		}
		
	}
	
	
    //3209408 //主厂房一层
    //3209771 //主厂房三层
    //3209377  生活消防水泵房建筑一层
    //3209332 生产废水及生活污水处理站建筑 F1
    //3209099 化学建筑一层
    var DataName = {
        3209044: 'huashuichejian',//base
        3209098: 'huashuichejian-1', //化学建筑
        3209331: 'shengchanfeishuijishenghuowushuichulizhan', //生产废水及生活污水处理站建筑
        3209376: 'huashuichejian-3', //生活消防水泵房
        3209407: 'huashuichejian-4', //主厂房
        3209679: 'huashuichejian-5', //主厂房二层
        3209408: 'zhuchangfang0m-1', //主厂房一层
        3209771: 'zhuchangfang12.6m-3' //主厂房三层
    };

    //faye接收数据
    var client = new Faye.Client('http://localhost:3000/faye');
    client.subscribe('/data', function (msg) {
        BUG_DATA = msg.abnormalData;
        TERMINAL_DATA = msg.terminalData.data;
        NUM = 0;

        console.log(msg)
        checkAbnormal(msg.abnormalData);
        changeLayerAlert(msg.abnormalData);
        fayeMsg(msg.terminalData.data, MAP_ID);
	
	    getPersonnelList(personnel_list, msg.terminalData.data);
    });

    function checkAbnormal(msg) {
        for (var i = 0; i < msg.qxdata.length; i++) {
            setColor(msg.qxdata[i].equipmentname, 0xFF4500)

        }
        for (var y = 0; y < msg.ycdata.length; y++) {
            setColor(msg.ycdata[y].equipmentname, 0xFFFF00)
        }
    }

    function setColor(msg, color) {
        var features = map.mapView._planarGraph.features.Area.features;
        for (var i = 0; i < features.length; i++) {
            if (features[i].properties.display && features[i].properties.display == msg) {
                map.setColor(features[i].parent, 'id', features[i].id, color);
            }
            map.resetColor(features[i].parent, 'id', features[i].id)
        }
    }

    function fayeMsg(msg, id) {
        if (DataName[id] && msg[NUM].mapName == DataName[id]) {
            editOverlay(msg[NUM])
        }else {
            nextMsg();
        }
    }

    //绘制标志的方法
    function editOverlay(msg) {
        var point = map.unoffset(msg.point.substring(0, msg.point.indexOf(',')), msg.point.substring(msg.point.indexOf(',') + 1));
        if (document.getElementById('overlay_' + msg.yhxtm) === null) {
            console.log('==添加标记==' + NUM);
            ADD_OVERLAY = setInterval(function () {
                addOverlay(point, msg);
                clearInterval(ADD_OVERLAY);
                nextMsg();
            }, 100)
        } else {
            changeTips(msg, point)
        }
    }

    function addOverlay(point, msg) {
        var overlay = map.addOverlay({
            url: '../images/search_marker.png',  //标志样式的存放地址
            position: [point.x + Math.random() * 100, point.y + Math.random() * 10],  //标志要添加的位置坐标
            size: [32, 32],  //标志的大小
            anchor: [0, 0],
            className: 'overlay-icon',
        });
        setOverlay(overlay, msg)
    }

    function setOverlay(overlay, msg) {
        overlay.targetDom.id = 'overlay_' + msg.yhxtm;
        overlay.on("click", function (e) {
            getLayerTips(msg, e)
        });

        ALL_OVERLAY[msg.yhxtm] = overlay;
    }

    function getLayerTips(msg, e) {
        layer.tips('<div>经纬度: ' + msg.point + '<br>用户名: ' + msg.name + '<br>任务描述: ' + msg.rwms + '<br>部门名称: ' + msg.deptname + '</div>', '#' + e.targetDom.id, {
            area: 'auto',
            maxWidth: '800px',
            skin: 'liu-tips-class',
            time: false,
            closeBtn: 1,
            tips: [1, 'white'],
            id: e.targetDom.id + "tips"
        });
    }

    function changeTips(msg, point) {
        if (document.getElementById(msg.yhxtm + "tips") != null) {
            var element = document.getElementById(msg.yhxtm + "tips").getElementsByTagName('div')[0];
            element.innerHTML = '<div>经纬度: ' + msg.point + '<br>用户名: ' + msg.name + '<br>任务描述: ' + msg.rwms + '<br>部门名称: ' + msg.deptname + '</div>';
        }
        ALL_OVERLAY[msg.yhxtm].position = {x: point.x + Math.random() * 100, y: point.y + Math.random() * 10};
        nextMsg();
    }

    function nextMsg() {
        NUM++;
        if (NUM <= TERMINAL_DATA.length - 1) {
            fayeMsg(TERMINAL_DATA, MAP_ID)
        }
    }

    var BuildingControl = setInterval(function () {
        getBuildingControl();
    }, 500);

    //监听楼层的方法
    function getFloorControl() {
        try {
            map.floorControl.on('change', function (e) {
                console.log('--监听到一次楼层变化--' + e.from + '--' + e.to)
                MAP_ID = e.to;

                set2dMap();
                layer.closeAll('tips');
            });
            console.log('==结束这个监听楼层变化的轮循==');
            clearInterval(FLOOR_CONTROL);
        } catch (err) {
            console.log('--监听楼层变化报错--' + err);
        }
    }

    //监听建筑物的方法
    function getBuildingControl() {
        try {
            map.buildingControl.on('change', function (e) {
                console.log('--监听到一次建筑物变化--' + e.from + '--' + e.to)
                layer.closeAll('tips');
                changeBuilding(e.to)
            });
            console.log('==结束这个监听建筑物变化的轮循==');
            clearInterval(BuildingControl);
        } catch (err) {
            console.log('--监听建筑物变化报错--' + err);
        }
    }

    function changeBuilding(id) {
        MAP_ID = id;

        clearInterval(FLOOR_CONTROL);
        set2dMap();
        if (id !== 3209044) {
            FLOOR_CONTROL = setInterval(function () {
                getFloorControl();
            }, 1000);
        }
    }

    //初始化地图时设置为2d
    function set2dMap() {
        clearInterval(SET_SKEW);
        SKEW_BUTTONS[0].innerText = '切换3d';
        SET_SKEW = setInterval(function () {
            console.log('切换2d---------------');
            map.skewTo(0);
            clearInterval(SET_SKEW);
            rmAllOverlay();
        }, 1000);
    }

    function rmAllOverlay() {
        var allOverlay = Object.values(ALL_OVERLAY);
        if (allOverlay.length !== TERMINAL_DATA.length) {
            return
        }
        while (allOverlay.length != 0) {
            console.log(allOverlay.length);
            map.removeOverlay(allOverlay.shift())
        }
    }

    //添加地图加载完成时的回调
    map.onLoad = function () {
        set2dMap();
        console.log(map._buildingInfoList);
        SKEW_BUTTONS[0].onclick = function () {
            if (SKEW_BUTTONS[0].innerText == '切换2d') {
                map.skewTo(0);
                SKEW_BUTTONS[0].innerText = '切换3d';
            } else {
                map.skewTo(60);
                SKEW_BUTTONS[0].innerText = '切换2d';
            }

        };
    };


    function changeLayerAlert(msg) {
        if (document.getElementById("layer-alert") != null) {
            var element = document.getElementById("layer-alert").getElementsByTagName('div')[0];
            element.innerHTML = getAlertData(BUILDING_INFO, msg);
        }
    }

    function getAlertData(name, msg) {
        var alertData = '<div>设备名: ' + name.display + '<br>设备id: ' + name.data_id + '</div>';
        if(msg == undefined){
            return alertData;
        }
        for (var i = 0; i < msg.qxdata.length; i++) {
            if (name.display == msg.qxdata[i].equipmentname) {
                alertData += '<div><div>缺陷: </div>缺陷现象: ' + msg.qxdata[i].qxapp + '<br>缺陷状态: ' + msg.qxdata[i].qxstatus + '<br>发现时间: ' + msg.qxdata[i].findtime + '<br>发现人: ' + msg.qxdata[i].finder + '</div>';
            }
        }
        for (var y = 0; y < msg.ycdata.length; y++) {
            if (name.display == msg.ycdata[y].equipmentname) {
                alertData += '<br><div><div>异常: </div>上限值: ' + msg.ycdata[y].sxz + '<br>下限值: ' + msg.ycdata[y].xxz + '<br>发现时间: ' + msg.ycdata[y].findtime + '<br>发现人: ' + msg.ycdata[y].finder + '</div>';
            }
        }
        return alertData
    }

    //给地图添加点击事件（以后要做点击建筑物或终端显示其基本信息）
    map.onClick = function (e) {
        var feature = e.feature;

        console.log(e);
        if (feature.parent.name === 'Area') {
            console.log('--这里是一个回调--');
            layer.alert('<div>' + getAlertData(feature.properties, BUG_DATA) + '</div>', {
                skin: 'layui-layer-molv' //样式类名
                , closeBtn: 0, id: 'layer-alert'
            });
            BUILDING_INFO = feature.properties;
            map.setColor(feature.parent, 'id', feature.id, 0xff0000);
        }
    };


    map.render(3033);
    // map.dataSource.requestMaps().then(result_callback).catch(fail_callback);
    // map.dataSource.requestMap(3033).then(result_callback).catch(fail_callback);
    // map.dataSource.requestPlanarGraph(3209408).then(result_callback).catch(fail_callback);
	
})(window);