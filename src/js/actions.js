var Fluxxor = require("fluxxor");

var constants = {
	ADD_VIDEO: "ADD_VIDEO",
	REMOVE_VIDEO: "REMOVE_VIDEO",
	CLEAR_VIDEOS: "CLEAR_VIDEOS"
};

var actions = {
  addVideo: function(videoInfoObject) {
    this.dispatch(constants.ADD_VIDEO, videoInfoObject);
  },

  removeVideo: function(storeId) {
    this.dispatch(constants.REMOVE_VIDEO, {storeId: storeId});
  },

  clearVideos: function() {
    this.dispatch(constants.CLEAR_VIDEOS);
  }
};

module.exports = actions;