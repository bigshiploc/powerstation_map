// (function (window) {
var engine = new NGR.engine.ThreeEngine();
window.mapView = new NGR.view.MapView("da706c00986c43c4ba63ed5d2c01993b");
var map = new NGR.map.Map({
    appKey: 'da706c00986c43c4ba63ed5d2c01993b',
    styleTemplate: '../stylesheets/template.json',
    floorControl: {
        // 是否启用控件，默认为true
        // 若要使用多楼层控件，必须先禁用单楼层控件
        enable: true
    },
});
var dataSource = new NGR.data.DataSource({
//通过开放平台获取的AppKey
    'appKey': 'da706c00986c43c4ba63ed5d2c01993b',
    server: 'https://api.ipalmap.com',
});


var floorControl = new NGR.control.FloorControl();
//添加楼层切换的监听事件



dataSource.requestMaps().then(function (maps) {
//获取第一张可用地图下包含的所有楼层
    console.log(maps)
    dataSource.requestPOIChildren(maps.list[0].poi).then(function (floors) {
        console.log(floors)
        mapView.addControl(floorControl);
// floorControl.addTo(mapView)
        floorControl.on('change', function (e) {
            console.log(12321)
            console.log(e.from, e.to);
        });
        function test() {
            dataSource.requestPlanarGraph(3209045).then(function (layerInfo) {
                // 此处插入地图数据
                console.log(layerInfo)
                NGR.fetch('../stylesheets/template.json', {})
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (style) {
                        var styleGenerator = new NGR.style.JSONStyleGenerator(style);
                        window.mapView.styleGenerator = styleGenerator;
                        var camera = new NGR.camera.ThreeCamera(45, window.innerWidth / window.innerHeight, 1, 80000);
                        //创建相机，并设置相机位置
                        camera.camera.position.set(0, 0, 100);    //设置MapView的相机视角
                        window.mapView.activeCamera = camera;    //在引擎中初始化MapView
                        engine.initMapView(window.mapView);    //根据数据构造平面图
                        var planarGraph = new NGR.data.PlanarGraph(layerInfo);    //渲染平面图
                        window.mapView.drawPlanarGraph(planarGraph);    //开始渲染
                        mapView.start();
                    })
                    .catch(onerror);
            });
        }
        floorControl.setFloorList(floors)
        floorControl.setCurrentFloor(floors[0].id, test)

    });

}).catch(function (e) {
    return console.error(e, e.stack);
});



//     var map = new NGR.map.Map({
// 		appKey: 'da706c00986c43c4ba63ed5d2c01993b',
// 		styleTemplate: '../stylesheets/template.json',
//
// 	});
//
// var result_callback = function (result) {
// 	console.log('===返回值result=== ' + JSON.stringify(result));
// };
//
// var fail_callback = function (e) {
// 	return console.error(e, e.stack);
// };
//
//     //添加地图加载完成时的回调
//     map.onLoad = function () {
//
// 		var arr = [[14100500.629299998,5708193.7654],[14100495.503700003,5708153.087099999],[14100440.729900002,5708156.914000001],[14100374.820500001,5708174.3869]];
//
// 		//添加标志和移动标志
// 		var overlay = map.addOverlay({
// 			url: '../images/search_marker.png',  //标志样式的存放地址
// 			position: arr[3],  //标志要添加的位置坐标
// 			size: [32, 32],  //标志的大小
// 			anchor: [0, 0],
// 			className: 'overlay-icon',
// 		});
//
// 		var i = 0;
// 		function getInterval() {
// 			// console.log(arr[i]);
// 			overlay.position = {x: arr[i][0], y: arr[i][1]};
//
// 			if (i < 3) {
// 				i++;
// 			} else {
// 				i = 0
// 			}
//
// 		}
// 		// setInterval(function () {
// 		// 	getInterval();
// 		// }, 2000);
//
//
// 		//给地图添加点击事件（以后要做点击建筑物或终端显示其基本信息）
// 		map.onClick = function (e) {
// 			var feature = e.feature;
//
// 			// console.log(feature);
// 			if (feature.parent.name === 'Area') {
// 				map.setColor(feature.parent, 'id', feature.id, 0xff0000);
// 			}
// 		};
//     };
map.render(3033);
// map.dataSource.requestMaps().then(result_callback).catch(fail_callback);
// map.dataSource.requestMap(3033).then(result_callback).catch(fail_callback);
// map.dataSource.requestPlanarGraph(3209408).then(result_callback).catch(fail_callback);


// })(window);