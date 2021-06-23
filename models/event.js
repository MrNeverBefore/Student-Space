const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true
  },
    eventTitle: {
    type: String,
    required: true
  },
  eventDesp: {
    type: String,
    required: true
  },
  eventDepartment: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  
  eventPublistDate: {
    type: String,
    required: true
  }
  
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
