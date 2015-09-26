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

	socket.on('ready', function(room) {

		socket.join(room);
		socket.room = room;

		db.getQueueById(room, function(err, row) {
			if (err) {
				socket.emit('alert', err);
				return console.log('error retrieving queue by id', err);
			}

			if (!row) {
				socket.emit('alert', 'This room does not exist! Refresh and try again.');	
				return;
			}

			var state = new Object();
			
			state.selectedVideos = JSON.parse(row.queue);
			state.currentVideo = JSON.parse(row.current);

			socket.emit('state:update', state);
		});
	});

	socket.on('queue:add', function(video) {
		desktop.to(socket.room).emit('queue:add', video);
	}); 

	socket.on('queue:playNext', function(id) {
		desktop.to(socket.room).emit('queue:playNext', id);
	}); 
});

desktop.on('connection', function(socket) {

	socket.on('ready', function(room) {

		socket.join(room);
		socket.room = room;

		db.getQueueById(room, function(err, row) {
			if (err) {
				socket.emit('alert', err);
				return console.log('error retrieving queue by id', err);
			}

			if (!row) {
				db.createQueue(room, function(err, row) {
					if (err) {
						socket.emit('alert', err);
						return console.log('error creating new queue', err);
					}
				});
				return;
			}

			var state = new Object();

			state.selectedVideos = JSON.parse(row.queue);
			state.currentVideo = JSON.parse(row.current);

			socket.emit('state:initialize', state);
		});
	});

	socket.on('state:update', function(state){

		console.log('state update')
		db.updateQueueById(socket.room, state.currentVideo, state.selectedVideos, function(err, row) {
			if (err) {
				console.log('db update')
				socket.emit('alert', err);
				return console.log('error updating queue by id', err);
			}
		});

		mobile.to(socket.room).emit('state:update', state);
		desktop.to(socket.room).emit('state:update', state);
	});
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:' + process.env.PORT || 3000);
});


