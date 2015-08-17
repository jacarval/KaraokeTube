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
					<div onClick={self.createQueueClickHandler(item)}>
						<a href="#"><img src={item.thumbnailUrl} /></a>
						<p>{item.title}</p>
					</div>
					<div className="btn-group-vertical" role="group">
						<button className="btn btn-info">
		            		<span className="glyphicon glyphicon-play" onClick={self.createPlayClickHandler(item)}></span>
		            	</button>
		            	<button className="btn btn-info">
		            		<span className="glyphicon glyphicon-plus" onClick={self.createQueueClickHandler(item)}></span>
		            	</button>
		            </div>
				</li>
			);
		});
		return (
			<ul ref="messages">
				{dataNodes}
			</ul>
		);
	}
});

module.exports = SearchResults;