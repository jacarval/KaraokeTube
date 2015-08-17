var React = require("react");

var VideoPlayer = React.createClass({
	render: function() {
		return (
			<div className="embed-responsive embed-responsive-16by9">
				<iframe className="embed-responsive-item" src={"https://www.youtube.com/embed/" + this.props.videoId + "?autoplay=1"} frameBorder="0" allowFullScreen></iframe>	
			</div>
		);
	}
});

module.exports = VideoPlayer;