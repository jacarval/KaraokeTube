var React = require("react");

var VideoSelector = React.createClass({
	componentDidMount: function() {
		socket.on("server:playlist:add", this.addVideoToQueue);
	},

	getInitialState: function() {
		return {searchData: [], currentVideo: '', selectedVideos: []};
	},

	requestSearchResults: function(querystring) {
		var data = [];
		var self = this;
		searchForSong(querystring, function(results) {
			for (var item of results.items){
				data.push({id: item.id.videoId, thumbnail: item.snippet.thumbnails.medium.url, title: item.snippet.title});
			}
			self.setState({searchData: data});
		});
	},

	addVideoToQueue: function(videoObject) {
		var data = this.state.selectedVideos;
		data.push(videoObject);
		this.setState({selectedVideos: data});
		this.setState({searchData: []});
	},

	removeVideoFromQueue: function(videoObject) {
		var data = this.state.selectedVideos;
		var index = data.indexOf(videoObject);
		if (index > -1) {
		    data.splice(index, 1);
		}
		this.setState({selectedVideos: data});
	},

	playVideo: function(videoObject) {
		this.setState({currentVideo: videoObject.id});
	},

	handleSearchResultClick: function(videoObject) {
		this.addVideoToQueue(videoObject);
		socket.emit("client:playlist:add", videoObject);
	},

	render: function() {
		return (
			<div className="row">
				<SearchBox
					onFormSubmit={this.requestSearchResults}
					onUserInput={function(data){console.log(data)}}
					placeholder="search"
				/>
				<SearchResults
					data={this.state.searchData}
					onQueueClick={this.handleSearchResultClick}
					onPlayClick={this.playVideo}
				/>
				<VideoQueue 
					data={this.state.selectedVideos} 
					onClick={this.playVideo}
					onRemoveClick={this.removeVideoFromQueue}
				/>
				<VideoPlayer
					videoId={this.state.currentVideo}
				/>
			</div>
		);
	}
});

module.exports = VideoSelector;