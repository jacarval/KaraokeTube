var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var db = require('./db');

app.use(express.static(__dirname + '/public'));

// Catchall - redirect to mobile or desktop page
app.get('*', function(req, res){

  res.sendFile(__dirname + '/public' + (/Android|iPhone|iPad/.test(req.headers['user-agent']) ? '/mobile.html' : '/desktop.html'));

});

var desktop = io.of('/desktop');
var mobile = io.of('/mobile');

mobile.on('connection', function(socket) {
	
	console.log('mobile connect');

	socket.on('ready', function() {
		console.log('mobile ready');
		db.getQueueById(1, function(err, row) {
			console.log(err, row)
			if (err) {
				socket.emit('alert', err);
			}
			var state = {};
			state.selectedVideos = JSON.parse(row.queue);
			state.currentVideo = JSON.parse(row.current);
			socket.emit('state:update', state);
		});
	});

	socket.on('queue:add', function(video) {
		desktop.emit('queue:add', video);
	}); 
});

desktop.on('connection', function(socket) {

	console.log('desktop connect')

	socket.on('ready', function() {
		db.getQueueById(1, function(err, row) {
			console.log(err, row);
			if (err) {
				socket.emit('alert', err);
			}
			var state = {};
			state.selectedVideos = JSON.parse(row.queue);
			state.currentVideo = JSON.parse(row.current);
			socket.emit('state:initialize', state);
		});
	});

	socket.on('state:update', function(state){
		console.log('updates from desktop')
		db.updateQueueById(1, state.currentVideo, state.selectedVideos, function(err, row) {
			console.log(err, row);
			if (err) {
				socket.emit('alert', err);
			}
		});
		mobile.emit('state:update', state);
	});
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});


