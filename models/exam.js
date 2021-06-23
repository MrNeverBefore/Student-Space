const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  examId: {
    type: String,
    required: true
  },
    examTitle: {
    type: String,
    required: true
  },
  subjectId: {
    type: String,
    required: true
  },
  examDate: {
    type: Date,
    required: true
  },
  
  fullMarks: {
    type: String,
    required: true
  }
  
});

const Exam = mongoose.model('Exam', ExamSchema);

module.exports = Exam;
