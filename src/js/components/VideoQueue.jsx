var React = require("react");

var VideoQueue = React.createClass({
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

	render: function() {
		var self = this;
		var dataNodes = this.props.data.map(function(item) {
			return (
				<li key={item.id} className="media">
					<div className="row">
						<div className="col-xs-10">
							<div className="media-body" onClick={self.createClickHandler(item)}>
								<div className="media">
									{/*<a href={"https://www.youtube.com/watch?v=" + item.id}><img src={item.thumbnail} /></a>*/}
									<a href="#"><img src={item.thumbnail} /></a>
								</div>
								<div className="media-body">
									<small className="text-muted">{item.title}</small>
								</div>
							</div>
						</div>
						<div className="col-xs-2">
							<div className="pull-right">
								<div className="btn-group-vertical" role="group">
									<button className="btn btn-info">
					            		<span className="glyphicon glyphicon-chevron-up"></span>
					            	</button>
					            	<button className="btn btn-info">
					            		<span className="glyphicon glyphicon-chevron-down"></span>
					            	</button>
					            </div>
					            <div className="btn-group-vertical" role="group">
									<button className="btn btn-info">
					            		<span className="glyphicon glyphicon-remove" onClick={self.createRemoveClickHandler(item)}></span>
					            	</button>
								</div>
							</div>
						</div>
					</div>
				</li>

			);
		});
		return (
			<div id = "queue_container" className="col-xs-2">
				<div className="panel panel-default">
					<div className="panel-body">
						<ul ref="messages" className="media-list">
							{dataNodes}
						</ul>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = VideoQueue;