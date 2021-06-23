const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    resourceId: {
        type: String,
        required: true
      },
        resourceTitle: {
        type: String,
        required: true
      },
      resourceDesp: {
        type: String,
        required: true
      },
      resourceLink: {
        type: String,
        required: true
      },
      resourceAuthor: {
        type: String,
        required: true
      },
      resourceDepartment: {
        type: String,
        required: true
      },
      resourcePublishDate: {
        type: String,
        required: true
      }
  
});

const Resource = mongoose.model('Resource', ResourceSchema);

module.exports = Resource;
