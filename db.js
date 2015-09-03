var pg = require('pg');

var DATABASE_URL = process.env.VIDEOS_DB_URL;

module.exports = {

	getVideosFromDB: function(callback) {
		querydb("SELECT * FROM videos", null, callback);
	},

	addVideoToDB: function(dataArray) {
		querydb("INSERT INTO videos (videoId, title, thumbUrl, selectedBy) VALUES($1, $2, $3, $4)", dataArray);
	},

	removeVideoFromDB: function(videoId) {
		querydb("DELETE FROM videos WHERE videoId=$1", [videoId]);
	},

	clearVideosFromDB: function(videoId) {
		querydb("DELETE FROM videos");
	},

};

function createdb() {
		pg.connect(DATABASE_URL, function(err, client) {

			if (err) throw err;

			client.query("CREATE TABLE IF NOT EXISTS videos(storeId serial PRIMARY KEY, videoId VARCHAR(15), title VARCHAR(100), thumbUrl VARCHAR(100), selectedBy VARCHAR(15))");
			client.query("CREATE TABLE IF NOT EXISTS queues(queueid serial PRIMARY KEY, queue VARCHAR(15) ARRAY)");

		});
	} 

function querydb(queryString, values, cb) {
	pg.connect(DATABASE_URL, function(err, client) {

		if (err) throw err;

		client	.query(queryString, values)
			  	.on('row', function(row) {
					if (cb) {
						cb(row);
					}
				});

		// client	.query('Select * from videos')
		// 		.on('row', function(row) {
		// 			console.log(JSON.stringify(row));
		// 		});
	});
}