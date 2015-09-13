var React = require("react");

var YouTube = require("react-youtube");

var VideoPlayer = React.createClass({
	render: function() {
		return (
			<div className="embed-responsive embed-responsive-16by9">
				<YouTube
					url={"https://www.youtube.com/watch?v=" + (this.props.currentVideo ? this.props.currentVideo.videoId : 'dQw4w9WgXcQ')}
					opts={ {playerVars: {autoplay: this.props.autoplay}} }
					onEnd={this.props.onVideoEnd}
				/>
			</div>
		);
	}
});

module.exports = VideoPlayer;