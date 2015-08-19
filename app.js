var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Flux = require('fluxxor');

app.get('/', function(req, res){

  res.sendFile(__dirname + '/index.html');

});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){

	socket.on("client:playlist:add", function(videoInfoObject){
		broadcastAddVideoToPlaylist(socket, videoInfoObject);
	});
	
});

function broadcastAddVideoToPlaylist(socket, videoInfoObject){
	socket.broadcast.emit("server:playlist:add", videoInfoObject);
}

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});