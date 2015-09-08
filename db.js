// var pg = require('pg');
// var DATABASE_URL = process.env.VIDEOS_DB_URL;
// createdb();

var query = require('pg-query');

query.connectionParameters = process.env.VIDEOS_DB_URL;

module.exports = {

	getQueueById: function(id, callback) {
		console.log('queue request by id');
		query.first("SELECT * FROM queues WHERE id=$1", [id], callback);
	},

	updateQueueById: function(id, current, queue, callback) {
		console.log('queue update by id');
		query("UPDATE queues SET current=$2,queue=$3 WHERE id=$1", [id, JSON.stringify(current), JSON.stringify(queue)], callback);
	},

	// getQueueById: function(id, callback) {
	// 	console.log('queue request by id');
	// 	querydb("SELECT * FROM queues WHERE id=$1", [id], callback);
	// },

	// updateQueueById: function(id, current, queue) {
	// 	console.log('queue update by id');
	// 	querydb("UPDATE queues SET current=$2,queue=$3 WHERE id=$1", [id, JSON.stringify(current), JSON.stringify(queue)]);
	// },

	// getAllQueues: function(callback) {
	// 	querydb("SELECT * FROM queues", null, callback);
	// },

	// addQueue: function(current, queue) {
	// 	querydb("INSERT INTO queues (current, queue) VALUES($1, $2)", [JSON.stringify(current), JSON.stringify(queue)]);
	// },

	// removeQueueById: function(id) {
	// 	querydb("DELETE FROM queues WHERE id=$1", [id]);
	// }
};

// function createdb() {
// 		pg.connect(DATABASE_URL, function(err, client) {

// 			if (err) throw err;

// 			client.query("CREATE TABLE IF NOT EXISTS queues(id serial PRIMARY KEY, current text, queue text)");

// 		});
// 	} 

// function querydb(queryString, values, cb) {
// 	pg.connect(DATABASE_URL, function(err, client) {

// 		if (err) throw err;

// 		client	.query(queryString, values)
// 			  	.on('row', function(row) {
// 					if (cb) {
// 						cb(row);
// 					}
// 				});

// 		client	.query('Select * from videos')
// 				.on('row', function(row) {
// 					console.log(JSON.stringify(row));
// 				});
// 	});
// }
