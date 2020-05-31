const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  imagePath: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Post', postSchema);
