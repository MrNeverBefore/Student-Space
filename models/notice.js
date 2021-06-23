const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  noticeId: {
    type: String,
    required: true
  },
  noticeTitle: {
    type: String,
    required: true
  },
  noticeDesp: {
    type: String,
    required: true
  },
  noticeDepartment: {
    type: String,
    required: true
  },
  dateOfNotice: {
    type: String,
    required: true
  },
  
});

const Notice = mongoose.model('Notice', NoticeSchema);

module.exports = Notice;
