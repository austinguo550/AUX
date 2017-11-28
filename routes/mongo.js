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
					}else {
						res.status(200).send("Updated");
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
			console.log("No room with that ID");
			res.status(400).send("No room with that ID found");
		}
	})
	res.send("Success");
}

var createRoom = function(req, res) {
	// TODO::::::
	// randomly create a Room ID -> roomId

	// then, check if the id is already in the collection
	appears = 1;
	randomId = "";
	while (count != 0) {
		Room.count( { roomId: randomId }, function(err, count) {
			if (err) {
				console.log("err: ", err);
			}
			if (count == 0) {
				appears = 0;
			}
		});
	}

	Room.create( { roomId: randomId }, function(err) {
		if (err) {
			console.log("err creating room:", err);
		} else {
			res.status(200).send("Success Creating Room");
		}
	});
}

function createReadID() {
	var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
	var randomId = "";
	for (var i = 0; i < 5; i++)
		randomId += possible.charAt(Math.floor(Math.random() * possible.length));
	return randomId;
}

/*
var getSongs = function(req,res) {
	var roomID = req.roomID;

	Room.findOne({roomId: roomID}, function(err, room) {
		if (err) {
			res.status(400).send('Bad Request');
		} else {

			songs = room.queue;
			console.log(songs);
			
			res.status(200).send(songs);
			Room.update(
				{roomid: roomID}, 
				{ $push: {queue: [] } });
		}
	});
}

*/

var checkRoomExists = function(roomID) {
	//check if room id exists

	//aka check if 
}


module.exports = {
	addSong: addSong,
	createRoom: createRoom,
	// getSongs: getSongs,
	checkRoomExists: checkRoomExists,
}