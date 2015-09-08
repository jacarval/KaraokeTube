var React = require("react");

var Search = React.createClass({
	handleSubmit: function(e) {

		var songName = React.findDOMNode(this.refs.searchInput).value.trim();
		this.props.onSubmit(songName);

		React.findDOMNode(this.refs.searchInput).value = '';

		e.preventDefault();
		return;
	},

	render: function() {
		return (
			<div className={this.props.visibility}>
				<form id="send" className="navbar-form" style={this.props.style} role ="search" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<div className="input-group">
							<span className="input-group-addon">
								<span className="glyphicon glyphicon-music"></span>
							</span>
							<input 
								type="text"
								className="form-control" 
								autoComplete="off"
								autoCorret="off"
								spellCheck="off"
								autoCapitalize="off"
								placeholder="KaraokeTube"
								ref="searchInput"
							/>
							<span className="input-group-btn">
								<button className="btn btn-default" type="submit">
									<span className="glyphicon glyphicon-search"></span>
								</button>
							</span>
						</div>
					</div>
				</form>
			</div>
		);
	}
});

module.exports = Search;