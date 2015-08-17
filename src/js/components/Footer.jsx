var React = require("react");

var Footer = React.createClass({

	createClickHandler: function(id) {
		var self = this;
	  	return function(e) {
	    	self.props.onClick(id);
	  	};
	},

	createRemoveClickHandler: function(id) {
		var self = this;
	  	return function(e) {
	    	self.props.onRemoveClick(id);
	  	};
	},

	renderVideoList: function() {
		var videos = this.props.selectedVideos;
		var nodes = Object.keys(videos).map(function(storeId) {
			return (
				<li key={storeId}>
					<p className="text-muted">| {videos[storeId].title} |</p>
				</li>
			);
		});
		return nodes;
	},

	render: function() {
		return (
			<footer className="footer">
		    	<div className="container">
			    	<div className="video-queue-list">
			    		<ul className="list-inline">
			    			{this.renderVideoList()}
			    		</ul>
			    	</div>
		    	</div>
		    </footer>
		);
	}
});

module.exports = Footer;