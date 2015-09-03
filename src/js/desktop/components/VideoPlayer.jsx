var React = require("react");

var YouTube = require("react-youtube");

var VideoPlayer = React.createClass({
	opts: {
		playerVars: {
			autoplay: 1
		}
	},

	render: function() {
		return (
			<div className="embed-responsive embed-responsive-16by9">
				<YouTube
					url={"https://www.youtube.com/watch?v=" + this.props.currentVideo.videoId}
					opts={this.opts}
					onEnd={this.props.onVideoEnd}
				/>
			</div>
		);
	}
});

module.exports = VideoPlayer;