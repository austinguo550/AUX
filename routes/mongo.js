var Room = require('../models/room');
var express = require('express');
var router = express.Router();

router.post('/addSong', function(req, res){
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
						//res.status(200).send("Updated");
						console.log("updated");
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
})

router.post('/createRoom', function(req, res){
	console.log("in backend")
	appears = 1;
	randomId = createRandomID();
	// while (appears != 0) {
	// 	console.log("counting rooms");
	// 	Room.count( { roomId: randomId }, function(err, count) {
	// 		if (err) {
	// 			console.log("err: ", err);
	// 		}
	// 		console.log(count)
	// 		if (count == 0) {
	// 			appears = 0;
	// 		}else{
	// 			randomId = createRandomID();
	// 		}
	// 	});
	// }
	// console.log("abt to create Room")

	Room.create( { roomId: randomId }, function(err) {
		if (err) {
			console.log("err creating room:", err);
		} else {
			res.status(200).send("room created with ID: " + randomId);
		}
	});
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

router.get('/checkRoomExists/:roomID', function(req, res) {
	console.log("in checkRoomExists backend");
	//check if room id exists
	roomID = req.params.roomID;
	Room.count( { roomId: roomID }, function(err, count) {
		console.log(count);
		if(count > 0) {
			console.log(count, " rooms with that ID: ", roomID);
		}
		else {
			console.log("No room with that ID");
			res.status(400).send("No room with that ID found");
		}
	})

})


module.exports = router;