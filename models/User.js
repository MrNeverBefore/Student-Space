const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ID: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  regNo: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  sessionFrom: {
    type: String,
    required: true
  },
  sessionTo: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  },
  sem: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
  
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
