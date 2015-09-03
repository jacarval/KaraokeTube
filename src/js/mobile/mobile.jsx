/*jshint esnext: true */
window.React = require("react");
window.socket = io();

var Fluxxor = require("fluxxor");
var VideoStore = require("./store.js");
var actions = require("./actions.js");
var requestSearchResults = require("../resources/misc.js").requestSearchResults;

/*
	React Components
 */
var Footer = require('./components/Footer.jsx');
var MediaList = require('./components/MediaList.jsx');
var NavBar = require('./components/NavBar.jsx');


var stores = {VideoStore: new VideoStore()};
var flux = new Fluxxor.Flux(stores, actions);

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Application = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("VideoStore")],

	getStateFromFlux: function() {
		var flux = this.getFlux();
		return flux.store("VideoStore").getState();
	},

	getInitialState: function() {
		return {currentUser: '', searchData: [], currentVideo: {selectedBy: "Rick", title: "Never Gonna Give You Up", videoId: "dQw4w9WgXcQ"}};
	},

	componentDidMount: function(){
		var self = this;

		socket.emit("client:getState");

		socket.on("server:playlist:initialize", function(video){
			self.getFlux().actions.addVideo(video);
		});

		socket.on("server:playlist:add", function(video){
			self.getFlux().actions.addVideo(video);
		});

		socket.on("server:playlist:remove", function(video){
			self.getFlux().actions.removeVideo(video);
		});

		socket.on("server:playlist:clear", function(){
			self.getFlux().actions.clearVideos();
		});

		socket.on("server:currentvideo:update", function(video){
			self.setState({currentVideo: video});
		});

		this.setState({currentUser: prompt('What is your name?')});
	},

	getSearchResultsFromYouTube: function(querystring) {
		var data = [];
		var self = this;
		requestSearchResults(querystring, function(results) {
			results.items.forEach(function(item){
				data.push({videoId: item.id.videoId, thumbnailUrl: item.snippet.thumbnails.medium.url, title: item.snippet.title, description: item.snippet.description, channel: item.snippet.channelTitle});
			});
			self.setState({searchData: data});
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

	addVideoToQueue: function(videoObject) {
		videoObject.selectedBy = this.state.currentUser;
		this.getFlux().actions.sAddVideo(videoObject);
		this.setState({searchData: []});
	},

	playNext: function(videoObject) {
		console.log(videoObject);
	},

	toggleContent: function() {
		if (this.state.searchData.length > 0) {
			return (<MediaList showContext={true} selectedVideos={this.state.searchData} onClick={this.addVideoToQueue}/>);
		}
		else {
			return (<MediaList showContext={false} selectedVideos={this.state.selectedVideos} onClick={this.playNext}/>);
		}
	},

	render: function() {
		return (
			<body>
				<NavBar onSearchSubmit={this.handleSearchSubmit}/>
				{this.toggleContent()}
				<Footer 
					selectedVideos = {this.state.selectedVideos}
					currentVideo = {this.state.currentVideo}
				/>
			</body>
		);
	}
});

React.initializeTouchEvents(true);
React.render( <Application flux={flux} /> , document.body);

