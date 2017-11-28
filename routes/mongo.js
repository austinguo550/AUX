var Room = require('./models/room');

var addSong = function(req, res) {
	var roomId = req.roomId;
	var songId = req.songId;

	Room.findOneAndUpdate( { roomId: roomId } ).then(function(room) {
		var queue = room.queue;
		queue.push(songId);
		room.save(done);
	})
}