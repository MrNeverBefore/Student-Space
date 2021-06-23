const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema({
  examId: {
    type: String,
    required: true
  },
    studentId: {
    type: String,
    required: true
  },
  batchId: {
    type: String,
    required: true
  },
  fullMarks: {
    type: String,
    required: true
  },
  obtainMarks: {
    type: String,
    required: true
  }
  
});

const Marks = mongoose.model('Marks', MarksSchema);

module.exports = Marks;
