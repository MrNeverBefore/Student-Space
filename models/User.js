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
  session: {
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
  gname: {
    type: String,
    required: true
  },
  rollNo: {
    type: String,
    required: true
  },
  DoB: {
    type: Date,
    required: true
  },
  batchId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
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
