var React = require("react");

var Footer = React.createClass({
	render: function() {
		return (
			<footer className="footer">
				<div className="container">
					<ul className="list-inline">
						<NowPlaying currentVideo = {this.props.currentVideo}/>
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
					Now Playing: {this.props.currentVideo ? ('['+this.props.currentVideo.selectedBy+'] - '+this.props.currentVideo.title) : "None"}
				</p>
			</li>
		);
	}
});

// var UpNext = React.createClass({
// 	generateList: function() {
// 		var videos = this.props.selectedVideos;
// 		var nodes = Object.keys(videos).map(function(id) {
// 			return (
// 				<li key={id}>
// 					<p className="text-muted"> 
// 						{'['+videos[id].selectedBy+'] - '+videos[id].title} <span className="glyphicon glyphicon-chevron-right"></span>
// 					</p>
// 				</li>
// 			);
// 		});

// 		if (nodes.length > 0) {
// 			return nodes;
// 		}
// 		else {
// 			return "None";
// 		}
// 	},

// 	render: function() {
// 		return (
// 			<li>
// 				<p className="text-muted">
// 					Up Next:
// 				</p>
// 			</li>
// 		);
// 	}
// });



// var ChevronSpacer = React.createClass({
// 	render: function() {
// 		return (

// 		);
// 	}
// });

module.exports = Footer;

