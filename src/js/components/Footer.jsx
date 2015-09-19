var React = require("react");

var Footer = React.createClass({
	renderVideoList: function() {
		var videos = this.props.selectedVideos;
		var nodes = Object.keys(videos).map(function(id) {
			return (
				<li key={id}>
					<p className="text-muted"> 
						{'['+(videos[id].selectedBy || 'None')+'] - '+(videos[id].title || 'None')} <span className="glyphicon glyphicon-chevron-right"></span>
					</p>
				</li>
			);
		});

		if (nodes.length > 0) {
			return nodes;
		}
		else {
			return "None";
		}
	},

	render: function() {
		return (
			<footer className="footer">
				<div className="container">
					<ul className="list-inline">
						<NowPlaying currentVideo = {this.props.currentVideo}/>
						<li role="separator" className="divider"></li>
						<li><span className="glyphicon glyphicon-chevron-right"></span></li>
						<li role="separator" className="divider"></li>
						<li><p className="text-muted">Up Next:</p></li>
						{this.renderVideoList()}
					</ul>
				</div>
			</footer>
		);
	}
});

var NowPlaying = React.createClass({
	render: function() {
		return (
			<li>
				<p className="text-muted">
					<span className='glyphicon glyphicon-play'></span> Now Playing: {this.props.currentVideo ? ('['+this.props.currentVideo.selectedBy+'] - '+this.props.currentVideo.title) : "None"}
				</p>
			</li>
		);
	}
});

module.exports = Footer;

