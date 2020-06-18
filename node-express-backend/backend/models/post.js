//include mongoose to create a Post model
const mongoose = require('mongoose');

//create blueprint
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }
});

//create model
module.exports = mongoose.model('Post', postSchema);