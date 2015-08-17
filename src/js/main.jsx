/*jshint esnext: true */
var React = require("react");
var Fluxxor = require("fluxxor");
var VideoStore = require("./store.js");
var YouTube = require("react-youtube");
var actions = require("./actions.js");
var requestSearchResults = require("./misc.js");

window.React = React;

var socket = io();

var stores = {VideoStore: new VideoStore()};

var flux = new Fluxxor.Flux(stores, actions);

window.flux = flux;

flux.on("dispatch", function(type, payload) {
  if (console && console.log) {
    console.log("[Dispatch]", type, payload);
  }
});

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Application = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("VideoStore")],

	handleSearchSubmit: function(songName, userName) {
		this.getSearchResultsFromYouTube(songName);
		this.setState({currentUser: userName});
	},

	getInitialState: function() {
		return {currentUser: '', searchData: [], currentVideo: {selectedBy: "Rick", title: "Never Gonna Give You Up", videoId: "dQw4w9WgXcQ"}};
	},

	getStateFromFlux: function() {
		var flux = this.getFlux();
		return flux.store("VideoStore").getState();
	},

	getSearchResultsFromYouTube: function(querystring) {
		var data = [];
		var self = this;
		requestSearchResults(querystring, function(results) {
			for (var item of results.items){
				data.push({videoId: item.id.videoId, thumbnailUrl: item.snippet.thumbnails.medium.url, title: item.snippet.title});
			}
			self.setState({searchData: data});
		});
	},

	addVideoToQueue: function(videoObject) {
		videoObject.selectedBy = this.state.currentUser;
		console.log(videoObject);
		this.getFlux().actions.addVideo(videoObject);
		this.setState({searchData: []});
	},

	playVideo: function(videoObject) {
		this.setState({currentVideo: videoObject});
	},

	removeVideoFromQueue: function(videoObject) {
		this.getFlux().actions.removeVideo(videoObject.storeId);
	},

	playVideoAndRemoveFromQueue: function(videoObject) {
		this.playVideo(videoObject);
		this.removeVideoFromQueue(videoObject);
	},

	playNextVideo: function() {
		var videos = this.getStateFromFlux().selectedVideos;
		var keys = Object.keys(videos);
		if (keys.length > 0) {
			this.playVideoAndRemoveFromQueue(videos[keys[0]]);
		}
	},

	emptyQueue: function() {
		this.getFlux().actions.clearVideos();
	},

	render: function() {
		return (
			<body>
				<NavBar 
					onSearchSubmit={this.handleSearchSubmit}
					onSearchInput={function(data){console.log(data)}}
					searchPlaceholder="search"
					onSearchResultClick={this.addVideoToQueue}
					onSearchResultPlayCick={this.playVideo}
					searchData={this.state.searchData}
					selectedVideos={this.state.selectedVideos}
					onQueuedVideoPlay={this.playVideoAndRemoveFromQueue}
					onEmptyTheQueueClick={this.emptyQueue}
				/>
				<Content 
					currentVideo={this.state.currentVideo}
					onVideoEnd={this.playNextVideo} 
				/>
				<Footer 
					selectedVideos={this.state.selectedVideos}
					currentVideo={this.state.currentVideo}
				/>
			</body>
		);
	}
});

var Content = React.createClass({
	render: function() {
		return (
			<div className="container">
				<VideoPlayer
					currentVideo={this.props.currentVideo}
					onVideoEnd={this.props.onVideoEnd}
				/>
			</div>
		);
	}
});

var VideoPlayer = React.createClass({
	opts: {
		playerVars: {
			autoplay: 1
		}
	},

	render: function() {
		return (
			<div className="embed-responsive embed-responsive-16by9">
				<YouTube
					url={"https://www.youtube.com/watch?v=" + this.props.currentVideo.videoId}
					opts={this.opts}
					onEnd={this.props.onVideoEnd}
				/>
			</div>
		);
	}
});

var NavBar = React.createClass({
	renderVideoList: function() {
		var videos = this.props.selectedVideos;
		var self = this;
		var nodes = Object.keys(videos).map(function(storeId) {
			return (
				<li key={storeId}>
					<a href="#" onClick={function(){return self.props.onQueuedVideoPlay(videos[storeId])}}>
						{videos[storeId].title}

					</a>
					{/*<span className="glyphicon glyphicon-remove" onclick={function() {return alert()}}></span>*/}
				</li>
			);
		});
		return nodes;
	},

	render: function() {
		return(
			<nav className="navbar navbar-default navbar-fixed-top">
		      <div className="container">
		        <div className="navbar-header">
		          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
		            <span className="sr-only">Toggle navigation</span>
		            <span className="icon-bar"></span>
		            <span className="icon-bar"></span>
		            <span className="icon-bar"></span>
		          </button>
		          <a className="navbar-brand" href="#">KaraokeTube</a>
		        </div>
		        <div id="navbar" className="collapse navbar-collapse">
		          <ul className="nav navbar-nav">
		            <li className="dropdown">
		              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Queue<span className="caret"></span></a>
		              <ul className="dropdown-menu">
		                <li><a href="#" onClick={this.props.onEmptyTheQueueClick}>Empty the Queue</a></li>
		                <li role="separator" className="divider"></li>
		                <li className="dropdown-header">Click to Play</li>
		                {this.renderVideoList()}
		              </ul>
		            </li>
		          </ul>
		          <SearchBox 
		          	placeholder={this.props.searchPlaceholder} 
		          	onSubmit={this.props.onSearchSubmit}
		          	onInput={this.props.onSearchInput}
		          />
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

var SearchBox = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var songName = React.findDOMNode(this.refs.searchInput).value.trim();
		var userName = React.findDOMNode(this.refs.nameInput).value.trim();
		if (!songName || !userName) {
			return;
		}
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
			<form id="send" className="navbar-form" role ="search" onSubmit={this.handleSubmit}>
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


			// <form id="send" className="navbar-form" role ="search" onSubmit={this.handleSubmit}>
			// 	<div className="form-group" style={{display:"inline"}}>
			// 		<div className="input-group" style={{display:"table"}}>
			// 			<input 
			// 				type="text"
			// 				className="form-control" 
			// 				autoComplete="off"
			// 				placeholder={this.props.placeholder}
			// 				ref="searchInput"
			// 				onChange={this.handleChange}
			// 			/>
			// 			<span type="submit" className="input-group-addon" style={{width:"1%"}}>
			// 				<span className="glyphicon glyphicon-search"></span>
			// 			</span>
			// 		</div>
			// 	</div>
			// </form>
		);
	}
});

var SearchResults = React.createClass({
	createQueueClickHandler: function(id) {
		var self = this;
	  	return function(e) {
	    	self.props.onQueueClick(id);
	  	};
	},

	createPlayClickHandler: function(id) {
		var self = this;
	  	return function(e) {
	    	self.props.onPlayClick(id);
		};
	},

	render: function() {
		var self = this;
		var dataNodes = this.props.data.map(function(item) {
			return(
				<li key={item.videoId}>
					<div onClick={self.createQueueClickHandler(item)}>
						<a href="#"><img src={item.thumbnailUrl} /></a>
						<p>{item.title}</p>
					</div>
					<div className="btn-group" role="group">
						<button className="btn btn-info">
		            		<span className="glyphicon glyphicon-play" onClick={self.createPlayClickHandler(item)}></span>
		            	</button>
		            	<button className="btn btn-info">
		            		<span className="glyphicon glyphicon-plus" onClick={self.createQueueClickHandler(item)}></span>
		            	</button>
		            </div>
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

var Footer = React.createClass({

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

	renderVideoList: function() {
		var videos = this.props.selectedVideos;
		var nodes = Object.keys(videos).map(function(storeId) {
			return (
				<li key={storeId}>
					<p className="text-muted"> 
						{'['+videos[storeId].selectedBy+'] - '+videos[storeId].title} <span className="glyphicon glyphicon-chevron-right"></span>
					</p>
				</li>
			);
		});

		if (nodes.length > 0) {
			return nodes;
		}
		else {
			return "None";
		}
	},

	render: function() {
		return (
			<footer className="footer">
		    	<div className="container">
			    	<div className="video-queue-list">
			    		<ul className="list-inline">
			    			<li>
			    				<p className="text-muted">
			    					Now Playing: {this.props.currentVideo ? ('['+this.props.currentVideo.selectedBy+'] - '+this.props.currentVideo.title) : "None"}
			    				</p>
			    			</li>
			    			<li role="separator" className="divider"></li>
			    			<li>
			    				<span className="glyphicon glyphicon-chevron-right"></span>
			    			</li>
			    			<li role="separator" className="divider"></li>
			    			<li>
			    				<p className="text-muted">
			    					Up Next:
			    				</p>
			    			</li>
			    			{this.renderVideoList()}
			    		</ul>
			    	</div>
		    	</div>
		    </footer>
		);
	}
});

React.render( <Application flux={flux} /> , document.body);



