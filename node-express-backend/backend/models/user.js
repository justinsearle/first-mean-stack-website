//include mongoose to create a User model
const mongoose = require('mongoose');

//use third party package to validate unique values
const uniqueValidator = require('mongoose-unique-validator');

//create blueprint
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, //unique is not for validation, just for internal optimizations for mongoose
  password: { type: String, required: true }
});

//add a plugin to the schema
userSchema.plugin(uniqueValidator);

//create model
module.exports = mongoose.model("User", userSchema);