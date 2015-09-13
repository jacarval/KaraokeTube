var Fluxxor = require("fluxxor");
var CONSTANTS = require("./constants");

var actions = {
  addVideo: function(video) {
    this.dispatch(CONSTANTS.ADD_VIDEO, video);
  },

  addVideoTop: function(video) {
    this.dispatch(CONSTANTS.ADD_VIDEO_TOP, video);
  },

  moveVideo: function(fromIndex, toIndex) {
    this.dispatch(CONSTANTS.MOVE_VIDEO, {from: fromIndex, to: toIndex});
  },

  removeVideo: function(index) {
    this.dispatch(CONSTANTS.REMOVE_VIDEO, index);
  },

  clearVideos: function() {
    this.dispatch(CONSTANTS.CLEAR_VIDEOS);
  },

  playVideoByIndex: function(index) {
    this.dispatch(CONSTANTS.PLAY_VIDEO_ID, index);
  },

  playNextVideo: function() {
    this.dispatch(CONSTANTS.PLAY_NEXT);
  },

  hydrate: function(state) {
    this.dispatch(CONSTANTS.HYDRATE, state);
  }
};

module.exports = actions;