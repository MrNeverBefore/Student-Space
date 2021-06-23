const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  attendanceBatchId: {
    type: String,
    required: true
  },
    attendanceMonth: {
    type: String,
    required: true
  },
  attendanceYear: {
    type: String,
    required: true
  },
  attendanceStudentId: [{
    type: String,
    required: true
  }],
  attendancePercentage: [{
    type: String,
    required: true
  }]


  
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;
