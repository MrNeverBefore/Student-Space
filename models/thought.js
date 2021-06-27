const mongoose = require('mongoose');

const ThoughtSchema = new mongoose.Schema({
 
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  batchId: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  thought: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
  
});

const Thought = mongoose.model('Thought', ThoughtSchema);

module.exports = Thought;
