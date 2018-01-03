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

    });

    var msgID = 3209044;
    var allOverlay = {};
    var AddOverlay;
    var FloorControl;
    var setSkew;
    var buttons = document.getElementsByClassName('btn');

    //3209408 //主厂房一层
    //3209771 //主厂房三层
    //3209377  生活消防水泵房建筑一层
    //3209332 生产废水及生活污水处理站建筑 F1
    //3209099 化学建筑一层
    var DataName = {
        3209044: 'huashuichejian',//base
        3209098: 'huashuichejian-1', //化学建筑
        3209331: 'huashuichejian-2', //生产废水及生活污水处理站建筑
        3209376: 'huashuichejian-3', //生活消防水泵房
        3209407: 'huashuichejian-4', //主厂房
        3209679: 'huashuichejian-5' //主厂房二层
    };

    //faye接收数据
    var client = new Faye.Client('http://localhost:3000/faye');
    client.subscribe('/data', function (msg) {
        fayeMsg(msg, msgID)
    });

    function fayeMsg(msg, id) {
        if (DataName[id]) {
            for (var i = 0; i < msg.length; i++) {
                if (msg[i].mapName == DataName[id]) {
                    tryAddOverlay(msg[i])
                }
            }
        }
    }

    function tryAddOverlay(msg, qyms) {
        AddOverlay = setInterval(function () {
            editOverlay(msg);
        }, 1000)
    }

    //绘制标志的方法
    function editOverlay(msg) {
        var point = map.unoffset(msg.point.substring(0, msg.point.indexOf(',')), msg.point.substring(msg.point.indexOf(',') + 1));
        if (document.getElementById(msg.sbms) === null) {
            console.log('==添加标记==');
            addOverlay(point, msg)
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
        clearInterval(AddOverlay);
        setOverlay(overlay, msg)
    }

    function setOverlay(overlay, msg) {
        overlay.targetDom.id = msg.sbms;
        overlay.on("click", function (e) {
            getLayerTips(msg, e)
        });

        allOverlay[msg.sbms] = overlay;
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
        if (document.getElementById(msg.sbms + "tips") != null) {
            var element = document.getElementById(msg.sbms + "tips").getElementsByTagName('div')[0];
            element.innerHTML = '<div>经纬度: ' + msg.point + '<br>用户名: ' + msg.name + '<br>任务描述: ' + msg.rwms + '<br>部门名称: ' + msg.deptname + '</div>';
        }
        allOverlay[msg.sbms].position = {x: point.x + Math.random() * 100, y: point.y + Math.random() * 10};
        clearInterval(AddOverlay);
    }

    var BuildingControl = setInterval(function () {
        getBuildingControl();
    }, 500);

    //监听楼层的方法
    function getFloorControl() {
        try {
            map.floorControl.on('change', function (e) {
                console.log('--监听到一次楼层变化--' + e.from + '--' + e.to)
                clearInterval(setSkew);

                msgID = e.to;
                set2dMap();
                layer.closeAll('tips');
            });
            console.log('==结束这个监听楼层变化的轮循==');
            clearInterval(FloorControl);
        } catch (err) {
            set2dMap();
            console.log('--监听楼层变化报错--' + err);
        }
    }

    //监听建筑物的方法
    function getBuildingControl() {
        try {
            map.buildingControl.on('change', function (e) {
                console.log('--监听到一次建筑物变化--' + e.from + '--' + e.to)
                clearInterval(setSkew)
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
        msgID = id;

        set2dMap();
        clearInterval(FloorControl);

        FloorControl = setInterval(function () {
            getFloorControl();
        }, 1000);
    }

    //初始化地图时设置为2d
    function set2dMap() {
        clearInterval(setSkew);
        buttons[0].innerText = '切换3d';
        setSkew = setInterval(function () {
            console.log('切换2d---------------')
            map.skewTo(0);
            clearInterval(setSkew)
        }, 1000)
    }

    //添加地图加载完成时的回调
    map.onLoad = function () {
        // tryAddOverlay(point);
        set2dMap();
        console.log(map._buildingInfoList)
        buttons[0].onclick = function () {
            if (buttons[0].innerText == '切换2d') {
                map.skewTo(0);
                buttons[0].innerText = '切换3d';
            } else {
                map.skewTo(60);
                buttons[0].innerText = '切换2d';
            }

        };
    };

    //给地图添加点击事件（以后要做点击建筑物或终端显示其基本信息）
    map.onClick = function (e) {
        var feature = e.feature;

        console.log(e);
        if (feature.parent.name === 'Area') {
            console.log('--这里是一个回调--');
            layer.alert(JSON.stringify(e.point), {
                skin: 'layui-layer-molv' //样式类名
                , closeBtn: 0
            });
            map.setColor(feature.parent, 'id', feature.id, 0xff0000);
        }
    };


    //添加地图加载完成时的回调
    // map.onLoad = function () {
    //
    //     var arr = [[14100500.629299998, 5708193.7654], [14100495.503700003, 5708153.087099999], [14100440.729900002, 5708156.914000001], [14100374.820500001, 5708174.3869]];
    //
    //     //添加标志和移动标志
    //     var overlay = map.addOverlay({
    //        url: '../images/search_marker.png',  //标志样式的存放地址
    //        position: arr[3],  //标志要添加的位置坐标
    //        size: [32, 32],  //标志的大小
    //        anchor: [0, 0],
    //        className: 'overlay-icon',
    //     });
    //
    //     var i = 0;
    //
    //     function getInterval() {
    //        // console.log(arr[i]);
    //        overlay.position = {x: arr[i][0], y: arr[i][1]};
    //
    //        if (i < 3) {
    //           i++;
    //        } else {
    //           i = 0
    //        }
    //
    //     }
    //
    //     // setInterval(function () {
    //     //     getInterval();
    //     // }, 2000);
    //
    //
    // };


    map.render(3033);
    // map.dataSource.requestMaps().then(result_callback).catch(fail_callback);
    // map.dataSource.requestMap(3033).then(result_callback).catch(fail_callback);
    // map.dataSource.requestPlanarGraph(3209408).then(result_callback).catch(fail_callback);


})(window);