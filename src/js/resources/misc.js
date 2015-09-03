function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

var requestSearchResults = function(querystring, callback) {
	var url = 'https://www.googleapis.com/youtube/v3/search';
	var params = '?part=snippet&q=' + querystring + " lyrics&type=video&maxResults=50&regionCode=US&key=AIzaSyAjZ9Y2YeyNJSk8Ko7T2iY-qTD-8QOUGBE";
	
	var xhr = createCORSRequest('GET', encodeURI(url + params));

	if (!xhr) {
		alert('This device is not supported');
		return;
	}

	xhr.onload = function() {
	    if (xhr.status === 200) {
			var results = JSON.parse(xhr.responseText);
			callback(results);
	    }
	    else {
	        alert('Request failed.  Returned status of ' + xhr.status);
	    }
	};
	xhr.send();
};

var createClickHandler = function(id, handler) {
		var self = this;
	  	return function(e) {
	    	handler(id);
	  	};
};

var constants = {
	ADD_VIDEO: "ADD_VIDEO",
	REMOVE_VIDEO: "REMOVE_VIDEO",
	CLEAR_VIDEOS: "CLEAR_VIDEOS",
	SADD_VIDEO: "SADD_VIDEO",
	SREMOVE_VIDEO: "SREMOVE_VIDEO",
	SCLEAR_VIDEOS: "SCLEAR_VIDEOS"
};

module.exports.requestSearchResults = requestSearchResults;
module.exports.createClickHandler = createClickHandler;
module.exports.constants = constants;