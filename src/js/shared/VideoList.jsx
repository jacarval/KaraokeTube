var React = require("react");
var createHandler = require("../resources/misc.js").createClickHandler;


var VideoList = React.createClass({
	render: function() {
		var videos = this.props.selectedVideos;
		var self = this;
		var nodes = []; 
		videos.forEach(function(video, index) {
			nodes.push(
				<ListItem 
					key={index}
					index={index}
					selectedBy={video.selectedBy}
					title={video.title}
					onRemoveClick={self.props.onRemoveClick}
					onPlayClick={self.props.onPlayClick}
					video={video}
				/>
			);
		});
		return (
			<div className="video-queue-list">
				<ul className="list-group">
					{nodes}
				</ul>
			</div>
		);
	}
});

var ListItem = React.createClass({
	render: function() {
		return (
			<li className="list-group-item">
				{'['+this.props.selectedBy+'] - '+this.props.title}
				<span href="#" className="badge" onClick={createHandler(this.props.index, this.props.onRemoveClick)}>
					<span className="glyphicon glyphicon-remove"></span>
				</span>
				<span href="#" className="badge" onClick={createHandler(this.props.index, this.props.onPlayClick)}>
					<span className="glyphicon glyphicon-play"></span>
				</span>
			</li>
		);
	}

});

module.exports = VideoList;