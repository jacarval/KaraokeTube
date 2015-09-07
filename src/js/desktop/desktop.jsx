/*jshint esnext: true */
var React = require("react");
var requestSearchResults = require("../resources/misc.js").requestSearchResults;
var socket = io(window.location.host + '/desktop');
var flux = require("Fluxxor");


window.React = React;

/*
	React Components
 */ 
var NavBar = require('./components/NavBar.jsx');
var Content = require('./components/Content.jsx');
var Footer = require('./components/Footer.jsx');

var Application = React.createClass({

	getInitialState: function() {
		return {showVideo: false, currentUser: '', searchData: [], currentVideo: {}, selectedVideos: []};
	},

	getSearchResultsFromYouTube: function(querystring) {
		var data = [];
		var self = this;
		requestSearchResults(querystring, function(results) {
			for (var item of results.items){
				data.push({videoId: item.id.videoId, thumbnailUrl: item.snippet.thumbnails.medium.url, title: item.snippet.title});
			}
			self.setState({searchData: data});
		});
	},

	componentDidMount: function(){
		var self = this;

		socket.emit('ready');

		socket.on('queue:add', function(video) {
			var videos = self.state.selectedVideos
			videos.push(video);
			
			socket.emit('queue:add', video);
		});

		socket.on('state:update', function(state) {
			self.setState({currentVideo: state.currentVideo, selectedVideos: state.selectedVideos});
		});
	},

	handleSearchSubmit: function(songName, userName) {
		this.setState({searchData: []});
		if (!songName || !userName) {
			return;
		}
		this.getSearchResultsFromYouTube(songName);
		this.setState({currentUser: userName});
	},

	addVideoToQueue: function(video) {
		video.selectedBy = this.state.currentUser;
		
		socket.emit('queue:add', video);

		this.setState({searchData: []});
	},

	removeVideoFromQueue: function(video) {
		socket.emit('queue:remove', video);
	},

	playVideoAndRemoveFromQueue: function(video) {
		socket.emit('video:play&remove', video);
	},

	playNextVideo: function() {
		var videos = this.state.selectedVideos
		console.log(videos);
		if (videos.length > 0) {
			this.playVideoAndRemoveFromQueue(videos[0]);
		}
	},

	emptyQueue: function() {
		socket.emit('queue:empty');
	},

	toggleVideoPlayer: function() {
		if (this.state.showVideo) {
			this.setState({showVideo: false});
		}
		else {
			this.setState({showVideo: true});
		}
	},

	render: function() {
		return (
			<body>
				<NavBar 
					onSearchSubmit={this.handleSearchSubmit}
					onSearchInput={function(data){console.log(data)}}
					onSearchResultClick={this.addVideoToQueue}
					onSearchResultPlayCick={this.playVideo}
					searchData={this.state.searchData}
					selectedVideos={this.state.selectedVideos}
					onQueuedVideoPlay={this.playVideoAndRemoveFromQueue}
					onEmptyTheQueueClick={this.emptyQueue}
					toggleVideoPlayer={this.toggleVideoPlayer}
					isVideoPlayerActive={this.state.showVideo}
				/>
				<Content 
					currentVideo={this.state.currentVideo}
					onVideoEnd={this.playNextVideo} 
					showVideo={this.state.showVideo}
					selectedVideos={this.state.selectedVideos}
					onPlayClick={this.playVideoAndRemoveFromQueue}
					onRemoveClick={this.removeVideoFromQueue}
				/>
				<Footer 
					selectedVideos={this.state.selectedVideos}
					currentVideo={this.state.currentVideo}
				/>
			</body>
		);
	}
});

React.render( <Application /> , document.body);



