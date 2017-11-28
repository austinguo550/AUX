var Room = require('../models/room');

var addSong = function(req, res) {
	var roomId = req.roomId;
	var songId = req.songId;

	Room.count( { roomId: roomId }, function(err, count) {
		console.log(count);
		if(count > 0) {
			Room.findOne( { roomId: roomId } ).then(function(room) {
				console.log(room.roomId);
				var queue = room.queue;
				queue.push(songId);
				room.save(done);
			})
		}
		else {
			Room.create( { roomId: roomId }, function(err) {
				console.log(err);
			});
			Room.findOne( { roomId: roomId } ).then(function(room) {
				console.log(room.roomId);
				var queue = room.queue;
				queue.push(songId);
				room.save(done);
			})
		}
	})
	// Room.findOne( { roomId: roomId } ).then(function(room) {
	// 	var queue = room.queue;
	// 	queue.push(songId);
	// 	room.save(done);
	// })
	res.send("Success");
}

module.exports = {
	addSong: addSong
}