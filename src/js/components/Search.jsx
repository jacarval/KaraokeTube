var React = require("react");

var Search = React.createClass({
	handleSubmit: function(e) {
		var songName = React.findDOMNode(this.refs.searchInput).value.trim();
		this.props.onSubmit(songName);

		React.findDOMNode(this.refs.searchInput).value = 'lyrics ';

		e.preventDefault();
		return;
	},

	handleNameChange: function(e) {
		this.props.onNameInput(
			e.target.value
		);
	},

	render: function() {
		return (
			<div className={this.props.visibility}>
				<form id="send" className="navbar-form navbar-left" style={this.props.style} role ="search" onSubmit={this.handleSubmit}>
					<div className="form-group">
						<div className={"input-group" + (this.props.hideName ? " hidden-xs" : "")}>
							<span className="input-group-addon">
								<span className="glyphicon glyphicon-user"></span>
							</span>
							<input 
								type="text"
								className="form-control" 
								autoComplete="off"
								placeholder="Enter Name"
								ref="nameInput"
								onChange={this.handleNameChange}
								value={this.props.userName}
							/>
						</div>
						<div className="input-group">
							<span className="input-group-addon">
								<span className="glyphicon glyphicon-music"></span>
							</span>
							<input 
								type="text"
								defaultValue="lyrics "
								className="form-control" 
								autoComplete="off"
								autoCorret="off"
								spellCheck="off"
								autoCapitalize="off"
								placeholder={this.props.placeholder}
								ref="searchInput"
								id="searchInput"
							/>
							<span className="input-group-btn">
								<button className="btn btn-default" type="submit">
									<span className="glyphicon glyphicon-search"></span><span className="caret"></span>
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