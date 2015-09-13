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
var NavBar = require('../components/NavBar.jsx');
var Content = require('../components/Content.jsx');
var Footer = require('../components/Footer.jsx');

var Application = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("VideoStore")],

	getInitialState: function() {
		return {showVideo: false, currentUser: '', searchData: [], autoplay: 0};
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

		socket.on('queue:playNext', function(id) {
			self.getFlux().actions.moveVideo(id, 0);
		});

		socket.on('alert', function(msg) {
			console.log(msg);
			alert('an error occured')
		});
	},

	handleSearchSubmit: function(songName) {
		var userName = this.state.currentUser;
		this.setState({searchData: []});
		if (!songName) {
			return;
		}
		if (!userName) {
			this.setState({currentUser: prompt('Enter a name and try again!')});
			return;
		}
		this.getSearchResultsFromYouTube(songName);
	},

	handleNameInput: function(userName) {
		this.setState({currentUser: userName});
	},

	addVideoToQueue: function(video) {
		this.setState({searchData: []});
		video.selectedBy = this.state.currentUser;
		this.getFlux().actions.addVideo(video);
	},

	addVideoToTopOfQueue: function(video) {
		this.setState({searchData: []});
		video.selectedBy = this.state.currentUser;
		this.getFlux().actions.addVideoTop(video);
	},

	moveVideoToTop: function(fromIndex) {
		this.getFlux().actions.moveVideo(fromIndex, 0);
	},

	removeVideoFromQueue: function(index) {
		this.getFlux().actions.removeVideo(index);
	},

	playVideoAndRemoveFromQueue: function(index) {
		this.setState({showVideo: true});
		this.getFlux().actions.playVideoByIndex(index);
	},

	playNextVideo: function() {
		this.getFlux().actions.playNextVideo();
	},

	emptyQueue: function() {
		this.getFlux().actions.clearVideos();
	},

	toggleVideoPlayer: function() {
		if (this.state.showVideo) {
			this.setState({showVideo: false});
		}
		else {
			this.setState({showVideo: true});
		}
	},

	toggleAutoplay: function() {
		if (this.state.autoplay) {
			this.setState({autoplay: 0});
		}
		else {
			this.setState({autoplay: 1});
		}
	},

	render: function() {
		return (
			<body>
				<NavBar 
					onSearchSubmit={this.handleSearchSubmit}
					onNameInput={this.handleNameInput}
					userName={this.state.currentUser}
					selectedVideos={this.state.selectedVideos}
					onQueuedVideoPlay={this.playVideoAndRemoveFromQueue}
					onEmptyTheQueueClick={this.emptyQueue}
					toggleVideoPlayer={this.toggleVideoPlayer}
					isVideoPlayerActive={this.state.showVideo}
					toggleAutoplay={this.toggleAutoplay}
					autoplay={this.state.autoplay}
				/>
				<Content 
					onSearchResultAddClick={this.addVideoToQueue}
					onSearchResultPlayClick={this.addVideoToTopOfQueue}
					searchData={this.state.searchData}
					currentVideo={this.state.currentVideo}
					onVideoEnd={this.playNextVideo} 
					showVideo={this.state.showVideo}
					selectedVideos={this.state.selectedVideos}
					onPlayClick={this.playVideoAndRemoveFromQueue}
					onRemoveClick={this.removeVideoFromQueue}
					autoplay={this.state.autoplay}
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



