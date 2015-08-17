var React = require("react");

var Header = require("./Content.jsx");
var Header = require("./Footer.jsx");
var Header = require("./NavBar.jsx");
var Header = require("./SearchBox.jsx");
var Header = require("./VideoPlayer.jsx");
var Header = require("./VideoQueue.jsx");
var Header = require("./VideoSelector.jsx");


var Application = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("VideoStore")],

	getInitialState: function() {
		return {searchData: [], currentVideo: ''};
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
		this.getFlux().actions.addVideo(videoObject);
		this.setState({searchData: []});
	},

	playVideo: function(videoObject) {
		this.setState({currentVideo: videoObject.videoId});
	},

	removeVideoFromQueue: function(videoObject) {
		this.getFlux().action.removeVideo(videoObject.storeId);
	},

	playVideoAndRemoveFromQueue: function(videoObject) {
		this.playVideo(videoObject);
		this.removeVideoFromQueue(videoObject);
	},

	render: function() {
		return (
			<body>
				<NavBar 
					onSearchSubmit={this.getSearchResultsFromYouTube}
					onSearchInput={function(data){console.log(data)}}
					searchPlaceholder="search"
				/>
				{/*<VideoSelector />*/}
				<Content 
					currentVideo={this.state.currentVideo} 
					onSearchResultClick={this.addVideoToQueue}
					onSearchResultPlayCick={this.playVideo}
					searchData={this.state.searchData}
				/>
				<Footer 
					selectedVideos={this.state.selectedVideos}
				/>
			</body>
		);
	}
});

module.exports = Application;