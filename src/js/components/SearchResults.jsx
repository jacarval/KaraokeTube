var React = require("react");

var SearchResults = React.createClass({
	createQueueClickHandler: function(id) {
		var self = this;
	  	return function(e) {
	    	self.props.onQueueClick(id);
	  	};
	},

	createPlayClickHandler: function(id) {
		var self = this;
	  	return function(e) {
	    	self.props.onPlayClick(id);
		};
	},

	render: function() {
		var self = this;
		var dataNodes = this.props.data.map(function(item) {
			return(
				<li key={item.videoId}>
					<div>
						<a href="#"><img src={item.thumbnailUrl} onClick={self.createQueueClickHandler(item)} /></a>
						<div className="btn-group-vertical" role="group">
							<span className="btn btn-info" onClick={self.createPlayClickHandler(item)}>
			            		<span className="glyphicon glyphicon-play" ></span>
			            	</span>
			            	<span className="btn btn-info" onClick={self.createQueueClickHandler(item)}>
			            		<span className="glyphicon glyphicon-plus" ></span>
			            	</span>
			            </div>
		            </div>
					<a href="#"><small className="text-muted" onClick={self.createQueueClickHandler(item)}> {item.title} </small></a>
				</li>
			);
		});
		return (
			<div className="search-result-list">
				<ul className="list-inline">
					{dataNodes}
				</ul>
			</div>
		);
	}
});

module.exports = SearchResults;