var React = require("react");
var createHandler = require("../resources/misc.js").createClickHandler;

var SearchResults = React.createClass({
	render: function() {

		var self = this;
		var dataNodes = this.props.data.map(function(item) {
			return(
				<li key={item.videoId}>
					<div>
						<a href="#">
							<img src={item.thumbnailUrl} onClick={createHandler(item, self.props.onQueueClick)} />
						</a>
						<div className="btn-group-vertical" role="group">
							<span className="btn btn-info" onClick={createHandler(item, self.props.onPlayClick)}>
			            		<span className="glyphicon glyphicon-play" ></span>
			            	</span>
			            	<span className="btn btn-info" onClick={createHandler(item, self.props.onQueueClick)}>
			            		<span className="glyphicon glyphicon-plus" ></span>
			            	</span>
			            </div>
		            </div>
					<a href="#"><small className="text-muted" onClick={createHandler(item, self.props.onQueueClick)}> {item.title} </small></a>
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