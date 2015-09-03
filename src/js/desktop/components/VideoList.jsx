var React = require("react");

var VideoList = React.createClass({
	createRemoveClickHandler: function(id) {
		var self = this;
	  	return function(e) {
	    	self.props.onRemoveClick(id);
	  	};
	},

	createPlayClickHandler: function(id) {
		var self = this;
	  	return function(e) {
	    	self.props.onPlayClick(id);
		};
	},

	render: function() {
		var videos = this.props.selectedVideos;
		var self = this;
		var dataNodes = Object.keys(videos).map(function(storeId) {
			return(
				<li key={storeId} className="list-group-item">
					{'['+videos[storeId].selectedBy+'] - '+videos[storeId].title}
					<span href="#" className="badge" onClick={self.createRemoveClickHandler(videos[storeId])}>
						<span className="glyphicon glyphicon-remove"></span>
					</span>
					<span href="#" className="badge" onClick={self.createPlayClickHandler(videos[storeId])}>
						<span className="glyphicon glyphicon-play"></span>
					</span>
				</li>
			);
		});
		return (
			<div className="video-queue-list">
				<ul className="list-group">
					{dataNodes}
				</ul>
			</div>
		);
	}
});

module.exports = VideoList;