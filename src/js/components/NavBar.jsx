var React = require("react");
var Search = require("./Search.jsx");

var NavBar = React.createClass({
	render: function() {
		return (
			<nav id="navnav" className="navbar navbar-default navbar-fixed-top">
				<div className="container-fluid">

					<NavBarHeader name='KaraokeTube'>
						<Search placeholder="KaraokeTube | Search" visibility={'visible-xs-block'} hideName={true} style={{margin:'0'}} onSubmit={this.props.onSearchSubmit} onNameInput={this.props.onNameInput} userName={this.props.userName}/>
					</NavBarHeader>

					<NavBarCollapse>
						
						<NavBarNav align={'left'}>
							<NavBarDropDown name='GitHub'>
								<li className="dropdown-header">GitHub Links</li>
								<li><a href="https://github.com/jacarval/karaoke-tube">Code Repository</a></li>
								<li><a href="https://github.com/jacarval/karaoke-tube/issues">View/Report Issues</a></li>
							</NavBarDropDown>
							<li className={this.props.isVideoPlayerActive ? "active" : ""} onClick={this.props.toggleVideoPlayer}><a href="#">{this.props.isVideoPlayerActive ?  "SongQueue" : "VideoPlayer"}</a></li>
							<li className={this.props.autoplay ? "active" : ""} onClick={this.props.toggleAutoplay}><a href="#">AutoPlay</a></li>
						</NavBarNav>
						
						<Search placeholder="Enter Song" visibility={'hidden-xs'} onSubmit={this.props.onSearchSubmit} onNameInput={this.props.onNameInput} userName={this.props.userName}/>
						
						<NavBarNav align={'right'}>
							<li><a href="#"><span className="glyphicon glyphicon-phone"></span>{this.props.room}</a></li>
						</NavBarNav>

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
				<a className="navbar-brand hidden-xs" href="#">{this.props.name}</a>
				{this.props.children}
			</div>
		);
	}
});

var NavBarCollapse = React.createClass({
	render: function() {
		return (
			<div className="collapse navbar-collapse" id="navbar">
				{this.props.children}
			</div>
		);
	}
});

var NavBarNav = React.createClass({
	render: function() {
		return (
			<ul className={"nav navbar-nav navbar-" + this.props.align}>
				{this.props.children}
			</ul>
		);
	}
});

var NavBarDropDown = React.createClass({
	render: function() {
		return (
			<li className="dropdown">
				<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{this.props.name}<span className="caret"></span></a>
				<ul className="dropdown-menu">
					{this.props.children}
				</ul>
			</li>
		);
	}
});

							// <NavBarDropDown name='Rooms'>
							// 	<li><a href="#">Hello</a></li>
							// </NavBarDropDown>

// var NavBarForm = React.createClass({
// 	render: function() {
// 		return (
// 			<form className="navbar-form navbar-left" role="search">
// 				<div className="form-group">
// 					<input type="text" className="form-control" placeholder="Name"/>
// 					<input type="text" className="form-control" placeholder="Search"/>
// 				</div>
// 				<button type="submit" className="btn btn-default">Submit</button>
// 			</form>
// 		);
// 	}
// });

// var NavBarToggleButton = React.createClass({
// 	render: function() {
// 		return (
// 			<button style={{marginTop: '11px'}} type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="navbar" aria-expanded="false">
// 				<span className="sr-only">Toggle navigation</span>
// 				<span className="icon-bar"></span>
// 				<span className="icon-bar"></span>
// 				<span className="icon-bar"></span>
// 			</button>
// 		);
// 	}
// });

module.exports = NavBar;