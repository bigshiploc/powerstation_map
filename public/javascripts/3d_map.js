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
    var message;
    var allOverlay = {};
    var AddOverlay;
    var FloorControl;
    var buttons = document.getElementsByClassName('btn');

    //faye接收数据
    var client = new Faye.Client('http://localhost:3000/faye');
	client.subscribe('/data', function(msg) {
        message= msg;
        fayeMsg(msg)
	});




    //获取唯一id
    function generateGuuId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    //绘制标志的方法
    function addOverlay(msg) {
        var piont = map.unoffset(msg.piont.substring(0, msg.piont.indexOf(',')), msg.piont.substring(msg.piont.indexOf(',') + 1));
        if(document.getElementById(msg.sbms)===null){
            console.log('==清除标记循环==');
            var overlay = map.addOverlay({
                url: '../images/search_marker.png',  //标志样式的存放地址
                position: [piont.x+Math.random()*100, piont.y+Math.random()*10],  //标志要添加的位置坐标
                size: [32, 32],  //标志的大小
                anchor: [0, 0],
                className: 'overlay-icon',
            });
            clearInterval(AddOverlay);
            overlay.targetDom.id = msg.sbms;
            allOverlay[msg.sbms] = overlay;
            overlay.on("click", function (e) {
                layer.tips('<div>'+msg.piont +'</div>', '#' + e.targetDom.id, {
                    area: 'auto',
                    maxWidth: '500px',
                    skin: 'liu-tips-class',
                    time: false,
                    closeBtn: 1,
                    tips: [1, 'white'],
                    id : e.targetDom.id+"tips"
                });
            })
        }else {
            if(document.getElementById(msg.sbms+"tips")!=null){
                console.log(msg.piont);
                document.getElementById(msg.sbms+"tips").getElementsByTagName('div')[0].innerText=allOverlay[msg.sbms].position
            }
            allOverlay[msg.sbms].position = {x:piont.x+Math.random()*100, y:piont.y+Math.random()*10};
            clearInterval(AddOverlay);
        }

    }


    //监听楼层的方法
    function getFloorControl() {
        try {
            map.floorControl.on('change', function (e) {
                console.log('--监听到一次楼层变化--' + e.from + '--' + e.to)

                fayeMsg(message);
            });
            console.log('==结束这个监听楼层变化的轮循==');
            clearInterval(FloorControl);
        } catch (err) {
            console.log('--监听楼层变化报错--' + err);
        }
    }

    //监听建筑物的方法
    function getBuildingControl() {
        try {
            map.buildingControl.on('change', function (e) {
                console.log('--监听到一次建筑物变化--' + e.from + '--' + e.to)
                fayeMsg(message);


                clearInterval(FloorControl);
                FloorControl = setInterval(function () {
                    getFloorControl();
                }, 500);
            });
            console.log('==结束这个监听建筑物变化的轮循==');
            clearInterval(BuildingControl);
        } catch (err) {
            console.log('--监听建筑物变化报错--' + err);
        }
    }

    function fayeMsg(msg) {
            if(msg[i].sbms==='设备描述1') {
                tryAddOverlay(msg[i])
            }
        
    }

    function tryAddOverlay(msg,qyms) {
                AddOverlay = setInterval(function () {
                    addOverlay(msg);
                }, 1000)
    }

    var BuildingControl = setInterval(function () {
        getBuildingControl();
    }, 500);

    //初始化地图时设置为2d
    function set2dMap() {
        buttons[0].innerText = '切换3d';
        map.skewTo(0);
    }

    //添加地图加载完成时的回调
    map.onLoad = function () {
        // tryAddOverlay(piont);
        set2dMap();

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
                ,closeBtn: 0
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