var React = require("react");

var SearchBox = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var songName = React.findDOMNode(this.refs.searchInput).value.trim();
		var userName = React.findDOMNode(this.refs.nameInput).value.trim().substr(0, 20);
		// if (!songName || !userName) {
		// 	return;
		// }
		this.props.onSubmit(songName, userName);
		React.findDOMNode(this.refs.searchInput).value = '';
		React.findDOMNode(this.refs.nameInput).value = '';
		return;
	},

	handleChange: function() {
		this.props.onInput(
			React.findDOMNode(this.refs.searchInput).value
		);
	},

	render: function() {
		return (
			<form id="send" className="navbar-form navbar-left" role ="search" onSubmit={this.handleSubmit}>
				<div className="form-group">
					<div className="input-group">
						<span className="input-group-addon">
							<span className="glyphicon glyphicon-user"></span>
						</span>
						<input 
							type="text"
							className="form-control" 
							autoComplete="off"
							placeholder="Enter Name"
							ref="nameInput"
						/>
					</div>
					<div className="input-group">
						<span className="input-group-addon">
							<span className="glyphicon glyphicon-music"></span>
						</span>
						<input 
							type="text"
							className="form-control" 
							autoComplete="off"
							placeholder="Enter Song"
							ref="searchInput"
							onChange={this.handleChange}
						/>
						<span className="input-group-btn">
							<button className="btn btn-default" type="submit">
								<span className="glyphicon glyphicon-search"></span>
							</button>
						</span>
					</div>
				</div>
			</form>
		);
	}
});

					// <div className="checkbox navbar-btn">
					// 	<label ClassName="navbar-link" for="filterUnfulfilled">
					// 		<input type="checkbox" ClassName="autosubmit" id="filterUnfulfilled" value="true"/>
					// 		<span className="text-muted"> + lyrics </span>
					// 	</label>
					// </div>

module.exports = SearchBox;