(function () {
	window.map = new NGR.View('map', {
		appKey: "da706c00986c43c4ba63ed5d2c01993b"
	});
	window.res = new NGR.DataSource({
		appKey: "da706c00986c43c4ba63ed5d2c01993b"
	});
	
	window.layers = {};
	
	var mapId = 3033;
	
	var control = NGR.control.floor();
	
	var onerror = function (e) {
		console.error(e, e.stack);
	};
	
	// map.on('click', function(e) {
	// 	var fromMarker = NGR.marker(e.latlng, {
	// 		//是否可以拖拽这个覆盖物
	// 		draggable: true
	// 	});
	// 	//添加到地图中
	// 	fromMarker.addTo(map);
	//
	// });
	
	
	// 请求楼层数据
	var loadPlanarGraph = function (planarGraphId) {
		res.requestPlanarGraph(planarGraphId).then(function (layerInfo) {
			// console.log(layerInfo);
			NGR.IO.fetch({
				url: '../stylesheets/style.json',
				onsuccess: JSON.parse
			}).then(function (style) {
				map.clear();
				// 加载各个图层
				layers.frame = NGR.featureLayer(layerInfo, {
					layerType: 'Frame',
					styleConfig: style
				});
				layers.area = NGR.featureLayer(layerInfo, {
					layerType: 'Area',
					styleConfig: style
				});
				layers.annotation = NGR.featureLayer(layerInfo.Area, {
					layerType: 'LogoLabel',
					styleConfig: style
				});
				layers.facility = NGR.featureLayer(layerInfo.Facility, {
					layerType: 'Facility',
					styleConfig: style
				});
				
				layers.collision = NGR.layerGroup.collision({
					margin: 3
				});
				layers.collision.addLayer(layers.annotation);
				layers.collision.addLayer(layers.facility);
				
				map.addLayer(layers.frame);
				map.addLayer(layers.area);
				map.addLayer(layers.collision);
				
				// 渲染地图
				map.render();
				
			}).catch(onerror);
		}).catch(onerror);
	};
	
	// 请求地图数据
	res.requestMap(mapId).then(function (mapInfo) {
		res.requestPOIChildren(mapInfo.poi).then(function (floors) {
			// 初始化楼层控件
			map.addControl(control);
			control.on('change', function (e) {
				control.setCurrentFloor(e.to, loadPlanarGraph);
			});
			control.setFloorList(floors);
			control.setCurrentFloor(floors[0].id, loadPlanarGraph);
		}).catch(onerror);
	}).catch(onerror);
}).call(this);