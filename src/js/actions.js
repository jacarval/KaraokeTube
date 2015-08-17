var Fluxxor = require("fluxxor");
var constants = require("./constants.js");

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