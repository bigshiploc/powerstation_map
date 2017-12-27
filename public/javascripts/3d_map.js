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
	
    //faye接收数据
	var client = new Faye.Client('http://localhost:3000/faye');
	client.subscribe('/test', function(msg) {
		console.log(msg + ' wangyongfei');
	});

	
    var AddOverlay;
    var FloorControl;
    var buttons = document.getElementsByClassName('btn');

    function generateGuuId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    //绘制标志的方法
    function addOverlay() {
        clearInterval(AddOverlay);
        console.log(map)
        console.log('==清除标记循环==');
        var overlay = map.addOverlay({
            url: '../images/search_marker.png',  //标志样式的存放地址
            position: [14100500.629299998, 5708193.7654],  //标志要添加的位置坐标
            size: [32, 32],  //标志的大小
            anchor: [0, 0],
            className: 'overlay-icon',
        });
        // console.log(overlay)
        overlay.targetDom.id = generateGuuId();

        return overlay.on("click", function (e) {
            console.log(e)
            layer.tips('<div>谷歌地图：45.5477151834，126.6668575089X<br>' +
                '百度地图：45.5533647497,126.6734948589<br>' +
                '腾讯高德：<span style="color: green">45.5477280458,126.6668754816</span><br>' +
                '图吧地图：45.5554916658,126.6652069116<br>' +
                '谷歌地球：45.5457016658,126.6608869116<br>北纬N4532*44.53’东经E1263939.19<br><br>' +
                '靠近：中国黑龙江省哈尔滨市平房区<br>' +
                '周边：市蔬菜基地约707米<br>' +
                '参考：黑龙江省哈尔滨市双城市周家镇东海村西北方</div>', '#' + e.targetDom.id, {
                area: 'auto',
                maxWidth: '500px',
                skin: 'liu-tips-class',
                time: false,
                closeBtn: 1,
                tips: [1, 'white']
            });
        })
    }


    //监听楼层的方法
    function getFloorControl() {
        try {
            map.floorControl.on('change', function (e) {
                console.log('--监听到一次楼层变化--' + e.from + '--' + e.to)

                tryAddOverlay();
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
                tryAddOverlay();


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

    function tryAddOverlay() {
        try {
            addOverlay();
            set2dMap();
        } catch (err) {
            AddOverlay = setInterval(function () {
                addOverlay();
                set2dMap();
            }, 1000)
        }
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
        tryAddOverlay()

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
		
		// console.log(feature);
		if (feature.parent.name === 'Area') {
			console.log('--这里是一个回调--');
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