var express = require('express');
var app = express();
var http = require('http').Server(app);
var Flux = require('fluxxor');
var pg = require('pg');
var io = require('socket.io')(http);

DATABASE_URL = process.env.VIDEOS_DB_URL;

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){

  res.sendFile(__dirname + '/index.html');

});

io.on('connection', function(socket){

	socket.join(socket.id);	

	pg.connect(DATABASE_URL, function(err, client) {
		if (err) throw err;

		client.query("CREATE TABLE IF NOT EXISTS videos(storeId serial PRIMARY KEY, videoId VARCHAR(15), title VARCHAR(100), thumbUrl VARCHAR(100), selectedBy VARCHAR(20))");


		client
		.query('Select * from videos')
		.on('row', function(row) {
			var payload = {
				storeId: row.storeid,
				videoId: row.videoid,
				title: row.title,
				thumbnailUrl: row.thumburl,
				selectedBy: row.selectedby
			};

			io.sockets.in(socket.id).emit("server:playlist:initialize", payload);
		});
	});

	socket.on("client:playlist:add", function(video) {
		socket.broadcast.emit("server:playlist:add", video);
		addVideoToDB([video.videoId, video.title, video.thumbnailUrl, video.selectedBy]);
	});

	socket.on("client:playlist:remove", function(video) {
		socket.broadcast.emit("server:playlist:remove", video);
		removeVideoFromDB(video.videoId);
	});

	socket.on("client:playlist:clear", function() {
		socket.broadcast.emit("server:playlist:clear");
		clearVideosFromDB();
	});
	
});

function initializeVideoList(socket, videoList){
	io.sockets.in(socket.id).emit('server:playlist:initialize', videoList);
}

function getAllVideosFromDB(callback) {
	querydb("SELECT * FROM videos", null, callback);
}

function addVideoToDB(dataArray) {
	querydb("INSERT INTO videos (videoId, title, thumbUrl, selectedBy) VALUES($1, $2, $3, $4)", dataArray);
}

function removeVideoFromDB(videoId) {
	querydb("DELETE FROM videos WHERE videoId=$1", [videoId]);
}

function clearVideosFromDB(videoId) {
	querydb("DELETE FROM videos");
}

function querydb(queryString, values, cb) {
	pg.connect(DATABASE_URL, function(err, client) {
		if (err) throw err;

		client
		.query(queryString, values)
		.on('row', function(row) {
			if (cb) {
				cb(row);
			}
		});

		client
		.query('Select * from videos')
		.on('row', function(row) {
			console.log(JSON.stringify(row));
		});
	});
}

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});