const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
const roomSchema = new Schema({
	roomId: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
	queue: {
    type: [String]
  },
	createdAt: Date,
	updatedAt: Date
});

// on every save, add the date
roomSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});


// create the mongoose model
const Room = mongoose.model('room', roomSchema);

module.exports = Room;