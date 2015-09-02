var pg = require('pg');

var DATABASE_URL = process.env.VIDEOS_DB_URL;

module.exports = {

	getAllVideosFromDB: function(callback) {
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

	querydb: function(queryString, values, cb) {
		pg.connect(DATABASE_URL, function(err, client) {

			if (err) throw err;

			client	.query(queryString, values)
				  	.on('row', function(row) {
						if (cb) {
							cb(row);
						}
					});

			client	.query('Select * from videos')
					.on('row', function(row) {
						console.log(JSON.stringify(row));
					});
		});
	}
};

function createDB() {
	pg.connect(DATABASE_URL, function(err, client) {

		if (err) throw err;

		client.query("CREATE TABLE IF NOT EXISTS videos(storeId serial PRIMARY KEY, videoId TEXT, title TEXT, thumbUrl TEXT, selectedBy TEXT)");
		client.query("CREATE TABLE IF NOT EXISTS queues(queueid serial PRIMARY KEY, order TEXT ARRAY)");

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

		client	.query('Select * from videos')
				.on('row', function(row) {
					console.log(JSON.stringify(row));
				});
	});
}