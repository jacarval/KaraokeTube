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

		socket.on("server:playlist:initialize", function(video){
			
			self.getFlux().actions.addVideo(video);

		});
	},

	getSearchResultsFromYouTube: function(querystring) {
		var data = [];
		var self = this;
		requestSearchResults(querystring, function(results) {
			for (var item of results.items){
				data.push({videoId: item.id.videoId, thumbnailUrl: item.snippet.thumbnails.medium.url, title: item.snippet.title, description: item.snippet.description, channel: item.snippet.channelTitle});
			}
			self.setState({searchData: data});
		});
	},

	handleSearchSubmit: function(songName) {
		var userName = 'test';
		this.setState({searchData: []});
		if (!songName || !userName) {
			return;
		}
		this.getSearchResultsFromYouTube(songName);
		this.setState({currentUser: userName});
	},	

	addVideoToQueue: function(videoObject) {
		videoObject.selectedBy = this.state.currentUser;
		this.getFlux().actions.addVideo(videoObject);
		this.setState({searchData: []});
	},

	render: function() {
		return (
			<body>
				<NavBar onSearchSubmit={this.handleSearchSubmit}/>
				<MediaList selectedVideos={this.state.searchData} onClick={this.addVideoToQueue}/>
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

