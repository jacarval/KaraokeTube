/*jshint esnext: true */
var React = require("react");
var Fluxxor = require("fluxxor");
var VideoStore = require("./store.js");
var actions = require("./actions.js");
var requestSearchResults = require("./misc.js");
var socket = io();

/*
	React Components
 */ 
var NavBar = require('./components/NavBar.jsx');
var Content = require('./components/Content.jsx');
var Footer = require('./components/Footer.jsx');

window.socket = socket;

window.React = React;

var stores = {VideoStore: new VideoStore()};

var flux = new Fluxxor.Flux(stores, actions);

window.flux = flux;

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Application = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("VideoStore")],

	tempVideoFix: {}, 

	componentDidMount: function(){
		var self = this;
		socket.on("server:playlist:initialize", function(video){
			self.tempVideoFix[video.videoId] = true;
			self.getFlux().actions.addVideo(video);
		});

		socket.on("server:playlist:add", function(video){
			self.getFlux().actions.addVideo(video);
		});

		socket.on("server:playlist:remove", function(video){
			self.tempVideoFix[video.videoId] = false;
			self.getFlux().actions.removeVideo(video);
		});

		socket.on("server:playlist:clear", function(){
			self.getFlux().actions.clearVideos();
		});

		socket.on("server:currentvideo:update", function(video){
			self.setState({currentVideo: video});
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

	getInitialState: function() {
		return {showVideo: false, currentUser: '', searchData: [], currentVideo: {selectedBy: "Rick", title: "Never Gonna Give You Up", videoId: "dQw4w9WgXcQ"}};
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

	addVideoToQueue: function(videoObject) {
		if (this.tempVideoFix[videoObject.videoId]) {
			alert("This video is already queued.");
			return;
		}
		else {
			this.tempVideoFix[videoObject.videoId] = true;
			videoObject.selectedBy = this.state.currentUser;
			this.getFlux().actions.sAddVideo(videoObject);
			this.setState({searchData: []});
		}
	},

	playVideo: function(videoObject) {
		this.setState({showVideo: true});
		this.setState({currentVideo: videoObject});
		this.setState({searchData: []});
		socket.emit('client:currentvideo:update', videoObject);
	},

	removeVideoFromQueue: function(videoObject) {
		this.tempVideoFix[videoObject.videoId] = false;
		this.getFlux().actions.sRemoveVideo(videoObject);
	},

	playVideoAndRemoveFromQueue: function(videoObject) {
		this.playVideo(videoObject);
		this.removeVideoFromQueue(videoObject);
	},

	playNextVideo: function() {
		var videos = this.getStateFromFlux().selectedVideos;
		var keys = Object.keys(videos);
		if (keys.length > 0) {
			this.playVideoAndRemoveFromQueue(videos[keys[0]]);
		}
	},

	emptyQueue: function() {
		this.getFlux().actions.sClearVideos();
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



