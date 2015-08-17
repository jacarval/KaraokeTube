/**
 * Module dependencies
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _getYoutubeId = require('get-youtube-id');

var _getYoutubeId2 = _interopRequireDefault(_getYoutubeId);

var _youtubeIframe = require('youtube-iframe');

var _youtubeIframe2 = _interopRequireDefault(_youtubeIframe);

/**
 * Create a new `player` by requesting and using the YouTube Iframe API
 *
 * @param {String} containerId - id of div container
 * @param {Object} props
 *   @param {String} url - url to be loaded
 *   @param {Object} playerVars - https://developers.google.com/youtube/player_parameters
 *
 * @param {Function} cb
 */

var createPlayer = function createPlayer(containerId, props, cb) {
  var params = (0, _objectAssign2['default'])({}, props.opts, {
    videoId: (0, _getYoutubeId2['default'])(props.url)
  });

  return _youtubeIframe2['default'].load(function (YT) {
    return cb(new YT.Player(containerId, params));
  });
};

/**
 * Expose `createPlayer`
 */

exports['default'] = createPlayer;
module.exports = exports['default'];