var React = require("react");
var Search = require("./Search.jsx");

var NavBar = React.createClass({
	render: function() {
		return (
			<nav className="navbar navbar-default">
				<div className="container-fluid">

					<NavBarHeader>
						<Search visibility={'visible-xs-block'} style={{margin:'0'}} onSubmit={this.props.onSearchSubmit}/>
					</NavBarHeader>

					<NavBarCollapse id='menu-collapse'>
						<NavBarLeft>
							<DropDown>
								<DropDownMenu />
							</DropDown>
						</NavBarLeft>
						<Search visibility={'hidden-xs'} onSubmit={this.props.onSearchSubmit}/>
					</NavBarCollapse>

				</div>
			</nav>		
		);
	}
});

var NavBarHeader = React.createClass({
	render: function() {
		return(
			<div className="navbar-header">
				{this.props.children}
				<a className="navbar-brand hidden-xs" href="#">KaraokeTube</a>
			</div>
		);
	}
});

var NavBarToggleButton = React.createClass({
	render: function() {
		return (
			<button style={{marginTop: '11px'}} type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target={this.props.target} aria-expanded="false">
				<span className="sr-only">Toggle navigation</span>
				<span className="icon-bar"></span>
				<span className="icon-bar"></span>
				<span className="icon-bar"></span>
			</button>
		);
	}
});

var NavBarCollapse = React.createClass({
	render: function() {
		return (
			<div className="collapse navbar-collapse" id={this.props.id}>
				{this.props.children}
			</div>
		);
	}
});

var NavBarLeft = React.createClass({
	render: function() {
		return (
			<ul className="nav navbar-nav">
				<li className="active"><a href="#">Search <span className="sr-only">(current)</span></a></li>
				<li><a href="#">Queue</a></li>
				{this.props.children}
			</ul>
		);
	}
});

var NavBarForm = React.createClass({
	render: function() {
		return (
			<form className="navbar-form navbar-left" role="search">
				<div className="form-group">
					<input type="text" className="form-control" placeholder="Name"/>
					<input type="text" className="form-control" placeholder="Search"/>
				</div>
				<button type="submit" className="btn btn-default">Submit</button>
			</form>
		);
	}
});

var NavBarRight = React.createClass({
	render: function() {
		return (
			<ul className="nav navbar-nav navbar-right">
				<li><a href="#">Link</a></li>
				{this.props.children}
			</ul>
		);
	}
});

var DropDown = React.createClass({
	render: function() {
		return (
			<li className="dropdown">
				<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Rooms <span className="caret"></span></a>
				{this.props.children}
			</li>
		);
	}
})

var DropDownMenu = React.createClass({
	render: function() {
		return (
			<ul className="dropdown-menu">
				<li><a href="#">Action</a></li>
				<li><a href="#">Another action</a></li>
				<li><a href="#">Something else here</a></li>
				<li role="separator" className="divider"></li>
				<li><a href="#">Separated link</a></li>
				<li role="separator" className="divider"></li>
				<li><a href="#">One more separated link</a></li>
			</ul>
		);
	}
});


module.exports = NavBar;