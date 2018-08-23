var express = require('express');
var app = express();
var port = 3000;
app.listen(port, function(err){
	console.log('server started at port: ' + port);
});