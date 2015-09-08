var Fluxxor = require("fluxxor");
var CONSTANTS = require("./constants");

var VideoStore = Fluxxor.createStore({

	initialize: function() {

		this.storeId = 0;
		this.selectedVideos = [];
		this.currentVideo = {};
		this.bindActions(		
			CONSTANTS.ADD_VIDEO, this.onAddVideo,
			CONSTANTS.REMOVE_VIDEO, this.onRemoveVideo,
			CONSTANTS.CLEAR_VIDEOS, this.onClearVideos,
			CONSTANTS.PLAY_VIDEO_ID, this.onPlayVideoByIndex,
			CONSTANTS.PLAY_NEXT, this.onPlayNextVideo,
			CONSTANTS.HYDRATE, this.hydrate
		);
	},

	onAddVideo: function(payload) {
		console.log('adding video');

		var storeId = this._nextStoreId();
		var video = {
				storeId: storeId,
				videoId: payload.videoId,
				title: payload.title,
				thumbnailUrl: payload.thumbnailUrl,
				selectedBy: payload.selectedBy
		};

		this.selectedVideos.push(video);

		this._emitChange();
	},

	onRemoveVideo: function(index) {
		console.log("removing video");

		this.selectedVideos.splice(index, 1);

		this._emitChange();
	},

	onClearVideos: function() {
		console.log("clearing queue");

		this.selectedVideos = [];

		this._emitChange();
	},

	onPlayVideoByIndex: function(index) {
		console.log("play video by index");

		this.currentVideo = this.selectedVideos[index];
		this.selectedVideos.splice(index, 1);

		this._emitChange();
	},

	onPlayNextVideo: function() {
		console.log("play next video");

		if (!this.selectedVideos[0]){

			this.currentVideo = this.selectedVideos[0];
			this.selectedVideos.splice(0, 1);

			this._emitChange();
		}
	},

	getState: function() {

		return {selectedVideos: this.selectedVideos, currentVideo: this.currentVideo};
	},

	hydrate: function(state) {
		console.log('hydrating store');

		this.currentVideo = state.currentVideo;
		this.selectedVideos = state.selectedVideos;

		this.emit("change");
	},

	_nextStoreId: function() {

		return ++this.storeId;
	},

	_emitChange: function() {
		var state = {currentVideo: this.currentVideo, selectedVideos: this.selectedVideos};
		console.log('store update event', state)
		socket.emit('state:update', state);
		this.emit("change");
	}
});

module.exports = VideoStore;