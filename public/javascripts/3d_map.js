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

    var AddOverlay;
    var FloorControl;

    //绘制标志的方法
    function addOverlay() {
        clearInterval(AddOverlay);
        console.log('==清除标记循环==');
        return map.addOverlay({
            url: '../images/search_marker.png',  //标志样式的存放地址
            position: [14100500.629299998, 5708193.7654],  //标志要添加的位置坐标
            size: [32, 32],  //标志的大小
            anchor: [0, 0],
            className: 'overlay-icon',
        });
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
        } catch (err) {
            AddOverlay = setInterval(function () {
                addOverlay();
            }, 1000)
        }
    }

    var BuildingControl = setInterval(function () {
        getBuildingControl();
    }, 500);


    window.onload = function(){
        console.log('初始化-============')
        // tryAddOverlay()
    }

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

    //给地图添加点击事件（以后要做点击建筑物或终端显示其基本信息）
    map.onClick = function (e) {
        var feature = e.feature;

        // console.log(feature);
        if (feature.parent.name === 'Area') {
            console.log('--这里是一个回调--');
            map.setColor(feature.parent, 'id', feature.id, 0xff0000);
        }
    };

    map.render(3033);
    // map.dataSource.requestMaps().then(result_callback).catch(fail_callback);
    // map.dataSource.requestMap(3033).then(result_callback).catch(fail_callback);
    // map.dataSource.requestPlanarGraph(3209408).then(result_callback).catch(fail_callback);


})(window);