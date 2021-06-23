const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  teacherName: {
    type: String,
    required: true
  },
  teacherId: {
    type: String,
    required: true
  },
  teacherDepartment: {
    type: String,
    required: true
  },
  teacherGender: {
    type: String,
    required: true
  },
  teacherEmail: {
    type: String,
    required: true
  },
  teacherPhone: {
    type: String,
    required: true
  }
  
});

const Teacher = mongoose.model('Teacher', TeacherSchema);

module.exports = Teacher;
