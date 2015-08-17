var Fluxxor = require("fluxxor");
var constants = require("./constants.js");

var VideoStore = Fluxxor.createStore({

	initialize: function() {

		this.storeId = 0;
		this.videos = {};
		this.bindActions(		
			constants.ADD_VIDEO, this.onAddVideo,
			constants.REMOVE_VIDEO, this.onRemoveVideo,
			constants.CLEAR_VIDEOS, this.onClearVideos
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

		this.videos[storeId] = video;

		this.emit("change");
	},

	onRemoveVideo: function(payload) {

		var storeId = payload.storeId;

		delete this.videos[storeId];

		this.emit("change");
	},

	onClearVideos: function() {

		var videos = this.videos;

		Object.keys(videos).forEach(function(key) {

			delete videos[key];
		});

		this.emit("change");
	},

	getState: function() {

		return {selectedVideos: this.videos};
	},

	_nextStoreId: function() {

		return ++this.storeId;
	}
});

module.exports = VideoStore;