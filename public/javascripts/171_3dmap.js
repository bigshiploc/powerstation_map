(function (window) {
	var result_callback = function (result) {
		console.log('===返回值result=== ' + JSON.stringify(result));
	};
	
	var fail_callback = function (e) {
		return console.error(e, e.stack);
	};
	
	var map = new NGR.map.Map({
		appKey: 'b7a7263084694c20b5294ed1e0aaf311',
		styleTemplate: '../stylesheets/template.json',
		
		
	});
	
	map.onLoad = function () {
		map.addOverlay({
			url: '../images/search_marker.png',
			position: [13525137.1413,3663480.5802],
			size: [32, 32],
			anchor: [0, 0],
			className: 'overlay-icon',
		});
	
	};
	
	map.render(171);
	// map.dataSource.requestMap(171).then(result_callback).catch(fail_callback);
	// map.dataSource.requestPlanarGraph(185817).then(result_callback).catch(fail_callback);
	// map.dataSource.requestPlanarGraph().then(result_callback).catch(fail_callback);
	
	
})(window);