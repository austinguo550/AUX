const assert = require('assert');
const Room = require('../models/room');

function generateId() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=<>?~";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// Describe tests
describe('Saving records', function() {
	// Create tests
	it('Saves a record to the database', function() {
		var room = new Room({
			roomId: generateId(),
			queue: []
		});

		room.save().then(function() {
			assert(room.isNew === false);
			done();
		});
	});
});