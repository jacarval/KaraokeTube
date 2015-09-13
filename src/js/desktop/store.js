var Fluxxor = require("fluxxor");
var CONSTANTS = require("./constants");

var VideoStore = Fluxxor.createStore({

	initialize: function() {

		this.storeId = 0;
		this.selectedVideos = [];
		this.currentVideo = {};
		this.bindActions(		
			CONSTANTS.ADD_VIDEO, this.onAddVideo,
			CONSTANTS.ADD_VIDEO_TOP, this.onAddVideoTop,
			CONSTANTS.MOVE_VIDEO, this.onMoveVideo,
			CONSTANTS.REMOVE_VIDEO, this.onRemoveVideo,
			CONSTANTS.CLEAR_VIDEOS, this.onClearVideos,
			CONSTANTS.PLAY_VIDEO_ID, this.onPlayVideoByIndex,
			CONSTANTS.PLAY_NEXT, this.onPlayNextVideo,
			CONSTANTS.HYDRATE, this.hydrate
		);
	},

	onAddVideo: function(payload) {

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

	onAddVideoTop: function(payload) {

		var storeId = this._nextStoreId();
		var video = {
				storeId: storeId,
				videoId: payload.videoId,
				title: payload.title,
				thumbnailUrl: payload.thumbnailUrl,
				selectedBy: payload.selectedBy
		};

		this.selectedVideos.unshift(video);

		this._emitChange();
	},

	onMoveVideo: function(payload) {

		var video = this.selectedVideos[payload.from];

		this.selectedVideos.splice(payload.from, 1);
		this.selectedVideos.splice(payload.to, 0, video);

		this._emitChange();
	},

	onRemoveVideo: function(index) {

		this.selectedVideos.splice(index, 1);

		this._emitChange();
	},

	onClearVideos: function() {

		this.selectedVideos = [];

		this._emitChange();
	},

	onPlayVideoByIndex: function(index) {

		this.currentVideo = this.selectedVideos[index];
		this.selectedVideos.splice(index, 1);

		this._emitChange();
	},

	onPlayNextVideo: function() {

		this.currentVideo = this.selectedVideos[0];
		this.selectedVideos.splice(0, 1);

		this._emitChange();
	},

	getState: function() {

		return {selectedVideos: this.selectedVideos, currentVideo: this.currentVideo};
	},

	hydrate: function(state) {

		this.currentVideo = state.currentVideo;
		this.selectedVideos = state.selectedVideos;

		this.emit("change");
	},

	_nextStoreId: function() {

		return ++this.storeId;
	},

	_emitChange: function() {
		var state = {currentVideo: this.currentVideo, selectedVideos: this.selectedVideos};
		socket.emit('state:update', state);
		this.emit("change");
	}
});

module.exports = VideoStore;