var React = require("react");

var SearchBox = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var data = React.findDOMNode(this.refs.formInput).value.trim();
		if (!data) {
			return;
		}
		this.props.onSubmit(data);
		React.findDOMNode(this.refs.formInput).value = '';
		return;
	},

	handleChange: function() {
		this.props.onInput(
			React.findDOMNode(this.refs.formInput).value
		);
	},

	render: function() {
		return (
			<form id="send" className="navbar-form" role ="search" onSubmit={this.handleSubmit}>
	          <div className="form-group" style={{display:"inline"}}>
		          <div className="input-group" style={{display:"table"}}>
		            <input 
		            	type="text"
		            	className="form-control" 
		            	autoComplete="off"
		            	placeholder={this.props.placeholder}
		            	ref="formInput"
		            	onChange={this.handleChange}
		            />
	            	<span type="submit" className="input-group-addon" style={{width:"1%"}}>
	            		<span className="glyphicon glyphicon-search"></span>
	            	</span>
		          </div>
	          </div>
	        </form>
		);
	}
});

module.exports = SearchBox;