/*jshint esnext: true */
var React = require("react");
var Fluxxor = require("Fluxxor");
var VideoStore = require("./store");

var requestSearchResults = require("../resources/misc").requestSearchResults;

var socket = io(window.location.host + '/desktop');
var stores = {VideoStore: new VideoStore()};
var actions = require("./actions");
var flux = new Fluxxor.Flux(stores, actions);

window.React = React;
window.socket = socket;
window.flux = flux;

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

var FluxMixin = Fluxxor.FluxMixin(React),
    StoreWatchMixin = Fluxxor.StoreWatchMixin;

/*
	React Components
 */ 
var NavBar = require('./components/NavBar.jsx');
var Content = require('./components/Content.jsx');
var Footer = require('./components/Footer.jsx');

var Application = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("VideoStore")],

	getInitialState: function() {
		return {showVideo: false, currentUser: '', searchData: []};
	},

	getStateFromFlux: function() {
		var flux = this.getFlux();

		return flux.store("VideoStore").getState();
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

		socket.on('state:initialize', function(state) {
			self.getFlux().actions.hydrate(state);
		});

		socket.on('queue:add', function(video) {
			self.getFlux().actions.addVideo(video);
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
		this.getFlux().actions.addVideo(video);
	},

	removeVideoFromQueue: function(index) {
		this.getFlux().actions.removeVideo(index);
	},

	playVideoAndRemoveFromQueue: function(index) {
		this.getFlux().actions.playVideoByIndex(index);
	},

	playNextVideo: function() {
		this.getFlux().actions.playNextVideo();
	},

	emptyQueue: function() {
		this.getFlux().actions.clearVideos(index);
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

React.render( <Application flux={flux} /> , document.body);



