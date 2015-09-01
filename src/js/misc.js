var requestSearchResults = function(querystring, callback) {
	var xhr = new XMLHttpRequest();
	var url = 'https://www.googleapis.com/youtube/v3/search';
	var params = '?part=snippet&q=' + querystring + " lyrics&type=video&maxResults=50&regionCode=US&key=AIzaSyAjZ9Y2YeyNJSk8Ko7T2iY-qTD-8QOUGBE";
	xhr.open('GET', encodeURI(url + params));
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

module.exports.requestSearchResults = requestSearchResults;
module.exports.createClickHandler = createClickHandler;