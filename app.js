var express = require('express');
var app = express();
var http = require('http').Server(app);
var Flux = require('fluxxor');
var io = require('socket.io')(http);
var db = require('./db');

app.use(express.static(__dirname + '/public'));

// Catchall - redirect to mobile or desktop page
app.get('*', function(req, res){

  res.sendFile(__dirname + '/public' + (/Android|iPhone|iPad/.test(req.headers['user-agent']) ? '/mobile.html' : '/desktop.html'));

});

var desktop = io.of('/desktop');
var mobile = io.of('/mobile');

io.on('connection', function(socket){

	socket.on("client:getState", function(){
		console.log('init!');
		db.getAllVideosFromDB(function(payload) {
			console.log('payload', payload);

			// lower cases db column names fix
			payload.selectedBy = payload.selectedby;
			payload.thumbnailUrl = payload.thumburl;

			socket.emit("server:playlist:initialize", payload);
		});
	});


	socket.on("client:playlist:add", function(video) {
		db.addVideoToDB([video.videoId, video.title, video.thumbnailUrl, video.selectedBy]);
		socket.broadcast.emit("server:playlist:add", video);
	});


	socket.on("client:playlist:remove", function(video) {		
		db.removeVideoFromDB(video.videoId);
		socket.broadcast.emit("server:playlist:remove", video);
	});


	socket.on("client:playlist:clear", function() {
		db.clearVideosFromDB();
		socket.broadcast.emit("server:playlist:clear");		
	});


	socket.on("client:currentvideo:update", function(video) {
		socket.broadcast.emit("server:currentvideo:update", video);
	});
	
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});


