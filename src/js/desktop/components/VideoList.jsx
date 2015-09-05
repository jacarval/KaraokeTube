var React = require("react");
var Sortable = require("react-sortable");

var createHandler = require("../../resources/misc.js").createClickHandler;


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
				<ListItem 
					key={storeId}
					selectedBy={videos[storeId].selectedBy}
					title={videos[storeId].title}
					onRemoveClick={self.props.onRemoveClick}
					onPlayClick={self.props.onPlayClick}
					video={videos[storeId]}
				/>
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

var ListItem = React.createClass({
	render: function() {
		return (
			<li key={this.props.key} className="list-group-item" draggable="true">
				{'['+this.props.selectedBy+'] - '+this.props.title}
				<span href="#" className="badge" onClick={createHandler(this.props.video, this.props.onRemoveClick)}>
					<span className="glyphicon glyphicon-remove"></span>
				</span>
				<span href="#" className="badge" onClick={createHandler(this.props.video, this.props.onPlayClick)}>
					<span className="glyphicon glyphicon-play"></span>
				</span>
			</li>
		);
	}

});

module.exports = VideoList;