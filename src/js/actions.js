var Fluxxor = require("fluxxor");

var constants = {
  ADD_VIDEO: "ADD_VIDEO",
  REMOVE_VIDEO: "REMOVE_VIDEO",
  CLEAR_VIDEOS: "CLEAR_VIDEOS",
  SADD_VIDEO: "SADD_VIDEO",
  SREMOVE_VIDEO: "SREMOVE_VIDEO",
  SCLEAR_VIDEOS: "SCLEAR_VIDEOS"
};

var actions = {
  addVideo: function(videoInfoObject) {
    this.dispatch(constants.ADD_VIDEO, videoInfoObject);
  },

  removeVideo: function(videoInfoObject) {
    this.dispatch(constants.REMOVE_VIDEO, videoInfoObject);
  },

  clearVideos: function() {
    this.dispatch(constants.CLEAR_VIDEOS);
  },
  
  sAddVideo: function(videoInfoObject) {
    this.dispatch(constants.SADD_VIDEO, videoInfoObject);
  },

  sRemoveVideo: function(videoInfoObject) {
    this.dispatch(constants.SREMOVE_VIDEO, videoInfoObject);
  },

  sClearVideos: function() {
    this.dispatch(constants.SCLEAR_VIDEOS);
  }
};

module.exports = actions;