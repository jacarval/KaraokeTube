var React = require("react");

var SearchBox = require('./SearchBox.jsx');
var SearchResults = require('./SearchResults.jsx');
var createHandler = require("../../resources/misc.js").createClickHandler;

var NavBar = React.createClass({
	render: function() {
		return(
			<nav className="navbar navbar-default navbar-fixed-top">
		      <div className="container">
		      	<NavBarHeader />
		        <div id="navbar" className="collapse navbar-collapse">
				  <ul className="nav navbar-nav">
				  	<li className={this.props.isVideoPlayerActive ? "active" : ""} onClick={this.props.toggleVideoPlayer}><a href="#">VideoPlayer</a></li>
				  	<VideoListDropDown 
			          	toggleVideoPlayer = {this.props.toggleVideoPlayer}
			          	onEmptyTheQueueClick = {this.props.onEmptyTheQueueClick}
			          	onQueuedVideoPlay = {this.props.onQueuedVideoPlay}
			          	selectedVideos = {this.props.selectedVideos}
		          	/>
		          	
				  </ul>
		          <SearchBox 
		          	onSubmit={this.props.onSearchSubmit}
		          	onInput={this.props.onSearchInput}
		          />
		          <GitHubDropDown />		         
		          <SearchResults
					data={this.props.searchData}
					onQueueClick={this.props.onSearchResultClick}
					onPlayClick={this.props.onSearchResultPlayCick}
				  />
		        </div>{/*<!--/.nav-collapse -->*/}
		      </div>
		    </nav>
    	);
	}
});

var NavBarHeader = React.createClass({
	render: function() {
		return (
			<div className="navbar-header">
				<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span className="sr-only">Toggle navigation</span>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
				</button>
				<a className="navbar-brand" href="#">KaraokeTube</a>
			</div>
		);
	}
});

var VideoListDropDown = React.createClass({
	renderVideoList: function() {
		var videos = this.props.selectedVideos;
		var self = this;
		var nodes = Object.keys(videos).map(function(storeId) {
			return (
				<li key={storeId}>
					<a href="#" onClick={createHandler(videos[storeId], self.props.onQueuedVideoPlay)} >
						{videos[storeId].title}
					</a>
				</li>
			);
		});
		return nodes;
	},

	render: function() {
		return (
			<li className="dropdown">
		      <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
		      	<span className="glyphicon glyphicon-th-list"></span>
		      	<span className="caret"></span>
		      </a>
		      <ul className="dropdown-menu">
		        <li><a href="#" onClick={this.props.onEmptyTheQueueClick}>Empty the Queue</a></li>
		        <li role="separator" className="divider"></li>
		        <li className="dropdown-header">Click to Play</li>
		        {this.renderVideoList()}
		      </ul>
		    </li>
		);
	}
});

var GitHubDropDown = React.createClass({
	render: function() {
		return(
			<ul className="nav navbar-nav navbar-right">
				<li className="dropdown">
			      <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
			      	<span>GitHub</span>
			      	<span className="caret"></span>
			      </a>
			      <ul className="dropdown-menu">
			      	<li className="dropdown-header">GitHub Links</li>
			        <li><a href="https://github.com/jacarval/karaoke-tube">Code Repository</a></li>
					<li><a href="https://github.com/jacarval/karaoke-tube/issues">View/Report Issues</a></li>
			      </ul>
			    </li>
		    </ul>
		);
	}
});

module.exports = NavBar;