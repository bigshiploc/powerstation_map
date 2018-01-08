var express = require('express');
var router = express.Router();

var path = require('path');


router.get('/', function (req, res, next) {
	res.render(path.join(__dirname, '../public/html', '3d_map.html'));
	console.log('开始进入地图页面');
	
});


module.exports = router;