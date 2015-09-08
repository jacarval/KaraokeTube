var React = require("react");

var VideoPlayer = require("./VideoPlayer.jsx");
var VideoList = require("./VideoList.jsx");


var Content = React.createClass({
	renderConditionalContent: function() {
		if (this.props.showVideo) {
			return (
				<VideoPlayer
					currentVideo={this.props.currentVideo}
					onVideoEnd={this.props.onVideoEnd}
					autoplay={this.props.autoplay}
				/>
			);
		}
		else if (Object.keys(this.props.selectedVideos).length){
			return (
				<VideoList 
					selectedVideos={this.props.selectedVideos}
					onPlayClick={this.props.onPlayClick}
					onRemoveClick={this.props.onRemoveClick}
				/>
			);
		}
		else {
			return (	
				<div className="jumbotron">
				  <h1>Welcome to KaraokeTube</h1>
				  <p>Add some songs to the queue...</p>
				</div>
			)
		}
	},

	render: function() {
		return(
			<div className="container">
				{this.renderConditionalContent()}
			</div>
		);
	}
});

module.exports = Content;