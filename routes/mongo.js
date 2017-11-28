var Room = require('../models/room');

var addSong = function(req, res) {
	var roomId = req.body.roomID;
	var songId = req.body.songID;

	Room.count( { roomId: roomId }, function(err, count) {
		console.log(count);
		if(count > 0) {
			Room.findOneAndUpdate( { roomId: roomId },
				{$push: {'queue': songId}},
				function(err) {
					if (err) {
						console.log("err: ", err);
					}
				}
			)
			Room.findOne( { roomId: roomId } ).then(function(room) {
				console.log("queue len: ", room.queue.length);
				room.queue.forEach( (song) => {
					console.log("song id: ", song);
				});
			})
		}
		else {
			// Room.create( { roomId: roomId }, function(err) {
			// 	console.log("err creating room:", err);
			// });
			// Room.findOneAndUpdate( { roomId: roomId },
			// 	{$push: {'queue': songId}},
			// 	function(err) {
			// 		if (err) {
			// 			console.log("err: ", err);
			// 		}
			// 	}
			// )
		}
	})
	res.send("Success");
}

var createRoom = function(req, res) {
	Room.create( { roomId: roomId }, function(err) {
		console.log("err creating room:", err);
	});
}

module.exports = {
	addSong: addSong
}