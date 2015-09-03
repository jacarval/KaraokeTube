var Fluxxor = require("fluxxor");

var constants = require("../resources/misc.js").constants;

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