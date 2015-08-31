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
					<p className="text-muted"> 
						{'['+videos[storeId].selectedBy+'] - '+videos[storeId].title} <span className="glyphicon glyphicon-chevron-right"></span>
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
			    	<div className="video-queue-list">
			    		<ul className="list-inline">
			    			<li>
			    				<p className="text-muted">
			    					Now Playing: {this.props.currentVideo ? ('['+this.props.currentVideo.selectedBy+'] - '+this.props.currentVideo.title) : "None"}
			    				</p>
			    			</li>
			    			<li role="separator" className="divider"></li>
			    			<li>
			    				<span className="glyphicon glyphicon-chevron-right"></span>
			    			</li>
			    			<li role="separator" className="divider"></li>
			    			<li>
			    				<p className="text-muted">
			    					Up Next:
			    				</p>
			    			</li>
			    			{this.renderVideoList()}
			    		</ul>
			    	</div>
		    	</div>
		    </footer>
		);
	}
});

module.exports = Footer;