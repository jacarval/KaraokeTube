/*jshint esnext: true */
var React = require("react");
var Fluxxor = require("fluxxor");
var VideoStore = require("./store.js");
var actions = require("./actions.js");
var requestSearchResults = require("./misc.js").requestSearchResults;

var socket = io();
window.socket = socket;

/*
	React Components
 */
var Footer = require('./mobile/Footer.jsx');
var PlayList = require('./mobile/PlayList.jsx');
var NavBar = require('./mobile/NavBar.jsx');


var stores = {VideoStore: new VideoStore()};
var flux = new Fluxxor.Flux(stores, actions);


window.React = React;
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

	getStateFromFlux: function() {
		var flux = this.getFlux();
		return flux.store("VideoStore").getState();
	},

	getInitialState: function() {
		return {currentUser: '', searchData: [], currentVideo: {selectedBy: "Rick", title: "Never Gonna Give You Up", videoId: "dQw4w9WgXcQ"}};
	},

	componentDidMount: function(){
		var self = this;

		socket.on("server:playlist:initialize", function(video){
			
			self.getFlux().actions.addVideo(video);

		});
	},

	render: function() {
		return (
			<body>
				<NavBar />

				<PlayList 
					selectedVideos = {this.state.selectedVideos}
				/>
				<Footer 
					selectedVideos = {this.state.selectedVideos}
					currentVideo = {this.state.currentVideo}
				/>
			</body>
		);
	}
});



React.render( <Application flux={flux} /> , document.body);

