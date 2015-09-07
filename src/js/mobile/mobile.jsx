/*jshint esnext: true */
window.React = require("react");

var socket = io(window.location.host + '/mobile');
var requestSearchResults = require("../resources/misc.js").requestSearchResults;

/*
	React Components
 */
var Footer = require('./components/Footer.jsx');
var MediaList = require('./components/MediaList.jsx');
var NavBar = require('./components/NavBar.jsx');

var Application = React.createClass({

	getInitialState: function() {
		return {currentUser: '', searchData: [], selectedVideos: [], currentVideo: {}};
	},

	componentDidMount: function(){
		var self = this;

		socket.emit('ready');

		socket.on('state:update', function(state) {
			self.setState({selectedVideos: state.selectedVideos, currentVideo: state.currentVideo});
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

	addVideoToQueue: function(video) {
		video.selectedBy = this.state.currentUser;

		socket.emit('queue:add', video)

		this.setState({searchData: []});
	},

	playNext: function(video) {
		console.log(video);
	},

	renderMediaList: function() {
		if (this.state.searchData.length > 0) {
			return (<MediaList buttonText="Add To Queue" selectedVideos={this.state.searchData} onClick={this.addVideoToQueue}/>);
		}
		else {
			return (<MediaList buttonText="Play Next (disabled)" selectedVideos={this.state.selectedVideos} onClick={this.playNext}/>);
		}
	},

	render: function() {
		return (
			<body>
				<NavBar onSearchSubmit={this.handleSearchSubmit}/>
				{this.renderMediaList()}
				<Footer 
					selectedVideos = {this.state.selectedVideos}
					currentVideo = {this.state.currentVideo}
				/>
			</body>
		);
	}
});

React.initializeTouchEvents(true);
React.render( <Application /> , document.body);

