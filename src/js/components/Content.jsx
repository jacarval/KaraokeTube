var React = require("react");

var Content = React.createClass({
	render: function() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-8">
						<VideoPlayer
							videoId={this.props.currentVideo}
						/>
					</div>
					<div className="col-md-4">
						<SearchResults
							data={this.props.searchData}
							onQueueClick={this.props.onSearchResultClick}
							onPlayClick={this.props.onSearchResultPlayCick}
						/>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Content;