var socket = io();

function searchForSong(querystring, callback) {
	var xhr = new XMLHttpRequest();
	var url = 'https://www.googleapis.com/youtube/v3/search'
	var params = '?part=snippet&q=' + querystring + " &type=video&maxResults=50&regionCode=US&key=AIzaSyAjZ9Y2YeyNJSk8Ko7T2iY-qTD-8QOUGBE"
	xhr.open('GET', encodeURI(url + params));
	xhr.onload = function() {
	    if (xhr.status === 200) {
			results = JSON.parse(xhr.responseText)
			callback(results);
	    }
	    else {
	        alert('Request failed.  Returned status of ' + xhr.status);
	    }
	};
	xhr.send();
}

var VideoSelector = React.createClass({
	componentDidMount: function() {
		socket.on("server:playlist:add", this.addVideoToQueue)
	},

	getInitialState: function() {
		return {searchData: [], currentVideo: '', selectedVideos: []}
	},

	requestSearchResults: function(querystring) {
		var data = [];
		var that = this;
		searchForSong(querystring, function(results) {
			for (var item of results.items){
				data.push({id: item.id.videoId, thumbnail: item.snippet.thumbnails.medium.url, title: item.snippet.title})
			}
			that.setState({searchData: data});
		});
	},

	addVideoToQueue: function(videoObject) {
		data = this.state.selectedVideos;
		data.push(videoObject);
		this.setState({selectedVideos: data});
		this.setState({searchData: []})
	},

	playVideo: function(videoObject) {
		this.setState({currentVideo: videoObject.id})
	},

	handleSearchResultClick: function(videoObject) {
		this.addVideoToQueue(videoObject);
		socket.emit("client:playlist:add", videoObject);
	},

	render: function() {
		return (
			<div>
				<SearchBox
					onFormSubmit={this.requestSearchResults}
					onUserInput={function(data){console.log(data)}}
					placeholder="search"
				/>
				<SearchResults
					data={this.state.searchData}
					onClick={this.handleSearchResultClick}
				/>
				<VideoQueue 
					data={this.state.selectedVideos} 
					onClick={this.playVideo}
				/>
				<VideoPlayer
					videoId={this.state.currentVideo}
				/>
			</div>
		);
	}
});

var VideoPlayer = React.createClass({
	render: function() {
		return (
		<div className="panel panel-default col-xs-8">
			<div className="panel-body">
				<div className="embed-responsive embed-responsive-16by9">
					<iframe width="560" height="315" src={"https://www.youtube.com/embed/" + this.props.videoId + "?autoplay=1"} frameBorder="0" allowFullScreen></iframe>	
				</div>
			</div>
		</div>
		);
	}
});

var VideoQueue = React.createClass({
	createClickHandler: function(id) {
		var that = this;
	  	return function(e) {
	    	that.props.onClick(id);
	  	};
	},

	render: function() {
		var that = this;
		var dataNodes = this.props.data.map(function(item) {
			return (
				<li key={item.id} className="media">
					<div className="row">
						<div className="col-xs-10">
							<div className="media-body" onClick={that.createClickHandler(item)}>
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
					            		<span className="glyphicon glyphicon-remove"></span>
					            	</button>
								</div>
							</div>
						</div>
					</div>
				</li>

			);
		});
		return (
			<div className="panel panel-default col-xs-2">
				<div className="panel-body">
					<ul ref="messages" className="media-list">
						{dataNodes}
					</ul>
				</div>
			</div>
		);
	}
});

var SearchResults = React.createClass({
	createClickHandler: function(id) {
		that = this;
	  	return function(e) {
	    	that.props.onClick(id);
	  	};
	},

	render: function() {
		var dataNodes = this.props.data.map(function(item) {
			return(
				<li key={item.id} className="media list-group-item" onClick={this.createClickHandler(item)}>
					<div className="media-body">
						<div className="media">
							{/*<a href={"https://www.youtube.com/watch?v=" + item.id}><img src={item.thumbnail} /></a>*/}
							<a href="#"><img src={item.thumbnail} /></a>
						</div>
						<div className="media-body">
							<small className="text-muted">{item.title}</small>
						</div>
					</div>
				</li>
			);
		}.bind(this));
		return (
		<div className="panel panel-default col-xs-2">
			<div className="panel-body">
				<ul ref="messages" className="media-list">
					{dataNodes}
				</ul>
			</div>
		</div>
		);
	}
});

var SearchBox = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		var data = React.findDOMNode(this.refs.formInput).value.trim();
		if (!data) {
		return;
		}
		this.props.onFormSubmit(data);
		React.findDOMNode(this.refs.formInput).value = '';
		return;
	},

	handleChange: function() {
		this.props.onUserInput(
			React.findDOMNode(this.refs.formInput).value
		)
	},

	render: function() {
		return (
			<form id="send" onSubmit={this.handleSubmit}>
	          <div className="input-group">
	            <input 
	            	type="text"
	            	className="form-control" 
	            	autoComplete="off"
	            	placeholder={this.props.placeholder}
	            	ref="formInput"
	            	onChange={this.handleChange}
	            />
	            <span className="input-group-btn">
	            	<button className="btn btn-info">
	            		<span className="glyphicon glyphicon-search"></span>
	            	</button>
	            </span>
	          </div>
	        </form>
		);
	}
});

React.render( <VideoSelector /> , document.getElementById("main-app"));