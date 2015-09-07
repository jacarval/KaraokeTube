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
		db.getQueueById(1, function(row) {
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
		db.getQueueById(1, function(row) {
			var state = {};
			state.selectedVideos = JSON.parse(row.queue);
			state.currentVideo = JSON.parse(row.current);
			socket.emit('state:initialize', state);
		});
	});

	socket.on('state:update', function(state){
		db.addQueue(state.currentVideo, state.selectedVideos);
		mobile.emit('state:update', state);
	});



	// socket.on('queue:add', function(video) {
	// 	state.selectedVideos.push(video);
	// 	mobile.emit('state:update', state);
	// });

	// socket.on('queue:remove', function(video) {
	// 	var videos = state.selectedVideos;
	// 	var position = videos.indexOf(videos.filter(function (val) {
	// 	      return val.videoId === video.videoId;
	// 	})[0]);
	// 	state.selectedVideos.splice(state.selectedVideos.indexOf(position, 1));
	// 	mobile.emit('state:update', state);
	// });

	// socket.on('queue:empty', function() {
	// 	state.selectedVideos = {};
	// 	mobile.emit('state:update', state);
	// });

	// socket.on('video:play&remove', function(video) {
	// 	var videos = state.selectedVideos;
	// 	var position = videos.indexOf(videos.filter(function (val) {
	// 	      return val.videoId === video.videoId;
	// 	})[0]);
	// 	state.selectedVideos.splice(state.selectedVideos.indexOf(position, 1));
	// 	mobile.emit('state:update', state);
	// });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});


