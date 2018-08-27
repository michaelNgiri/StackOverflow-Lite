var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
	res.send("hello world");
});

app.get('/hi', function (req, res) {
    res.send("hi there");
});

app.get('/foo/baa', function (req, res) {
    res.send("hi there");
});

//app.use(express.static(public));

app.listen(port, function(err){
	console.log('server started at port: ' + port);
});