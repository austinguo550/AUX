var Room = require('../models/room');
var express = require('express');
var router = express.Router();

router.post('/addSong', function(req, res){
	var roomId = req.body.roomID;
	var incomingSongID = req.body.songID;

	Room.count( { roomId: roomId }, function(err, count) {
		inQueue = false;
		if(count > 0) {
			Room.findOne( { roomId: roomId } ).then(function(room) {
				room.queue.forEach( (songID) => {
					if(songID == incomingSongID) {
						res.status(202).end("Song Already in Queue");
						inQueue = true;
						return;
					}
				});

				if (inQueue == false) {
					Room.findOneAndUpdate( { roomId: roomId },
						{$push: {'queue': incomingSongID}},
						function(err) {
							if (err) {
								res.status(501).end("internal server error");
								return;
							}else {
								res.status(200).end("Updated");
								return;
							}
						}
					)
				}				
			})
		}
		else {
			res.status(400).end("Room ID not Found");
			return;
		}
	})
})

router.post('/createRoom', function(req, res){

	function findUsableRoomID() {
		randomId = createRandomID();

		Room.count( { roomId: randomId }, function(err, count) {
			if (err) {
				return res.status(500).end();
			}

			if (count == 0) {
				Room.create( { roomId: randomId }, function(err) {
					if (err) {
						res.status(500).end();
					} else {
						res.status(200).end(randomId);
					}
				});
			}else{
				findUsableRoomID();
			}
		});
	}

	findUsableRoomID();

})




function createRandomID() {
	var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
	var randomId = "";
	for (var i = 0; i < 6; i++)
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


module.exports = router;