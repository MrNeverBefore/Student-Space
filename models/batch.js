const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true
  },
    batchDepartment: {
    type: String,
    required: true
  },
  admYear: {
    type: String,
    required: true
  },
  mentor: {
    type: String,
    required: true
  },
  hod: {
    type: String,
    required: true
  },
  
  currentSem: {
    type: String,
    required: true
  },
  currentYear: {
    type: String,
    required: true
  },
  subject: [{
    type: String,
    required: true
  }],
  exam: [{
    type: String,
    required: true
  }]


  
});

const Batch = mongoose.model('Batch', BatchSchema);

module.exports = Batch;
