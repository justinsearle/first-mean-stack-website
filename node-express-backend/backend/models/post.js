//include mongoose to create a Post model
const mongoose = require('mongoose');

//create blueprint for our Posts
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } //the type of this is a mongoose object ID (string). Also using the reference for our User model
});

//create model
module.exports = mongoose.model('Post', postSchema);