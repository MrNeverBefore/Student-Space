const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  subjectId: {
    type: String,
    required: true
  },
    subjectName: {
    type: String,
    required: true
  },
  subjectDepartment: {
    type: String,
    required: true
  },
  subjectType: {
    type: String,
    required: true
  }
  
});

const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject;
