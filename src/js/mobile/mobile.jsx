/*jshint esnext: true */
// if (window.location.host === 'karaoke.recurse.com') window.location.assign("http://karaoketube.herokuapp.com");

var host = (window.location.host === "karaoke.recurse.com" ? "karaoketube.herokuapp.com" : window.location.host);
var path = window.location.pathname.replace('/','');
var room = (window.location.host === "karaoke.recurse.com" ? "rc" : (path || prompt('Which room would you like to join?'))).toLowerCase();

window.React = require("react");

var socket = io(host + '/mobile');
var requestSearchResults = require("../resources/misc.js").requestSearchResults;

/*
	React Components
 */
var Footer = require('../components/Footer.jsx');
var MediaList = require('../components/MediaList.jsx');
var NavBar = require('../components/NavBar.jsx');

var Application = React.createClass({

	getInitialState: function() {
		return {
			currentUser: '', 
			searchData: [], 
			selectedVideos: [], 
			currentVideo: {}, 
		};
	},

	componentDidMount: function(){
		var self = this;

		socket.emit('ready', room);

		socket.on('state:update', function(state) {
			self.setState({selectedVideos: state.selectedVideos, currentVideo: state.currentVideo});
		});

		socket.on('alert', function(msg) {
			console.log(msg);
			alert('an error occured', msg);
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
		while (!userName) {
			this.setState({currentUser: prompt('Enter a name and try again!')});
			return;
		}
		this.getSearchResultsFromYouTube(songName);

		document.activeElement.blur();	
	},

	handleNameInput: function(userName) {
		this.setState({currentUser: userName});
	},

	addVideoToQueue: function(data) {
		var video = data.video;
		video.selectedBy = this.state.currentUser;
		socket.emit('queue:add', video)
		this.setState({searchData: []});
	},

	playNext: function(data) {
		socket.emit('queue:playNext', data.id);
	},

	getMediaListProps: function() {
		var search = this.state.searchData.length;
		return {
			text: (search ? "Add To Queue" : "Play Next"),
			list: (search ? this.state.searchData : this.state.selectedVideos),
			click: (search ? this.addVideoToQueue : this.playNext)
		};
	},

	render: function() {
		var mediaProps = this.getMediaListProps();
		return (
			<body>
				<NavBar onSearchSubmit={this.handleSearchSubmit} onNameInput={this.handleNameInput} userName={this.state.currentUser}/>
				<MediaList buttonText={mediaProps.text} videoList={mediaProps.list} onClick={mediaProps.click}/>
				<Footer selectedVideos = {this.state.selectedVideos} currentVideo = {this.state.currentVideo}/>
			</body>
		);
	}
});

React.initializeTouchEvents(true);
React.render( <Application /> , document.body);

