const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  age: Number,
  description: String,
  followers: [], // set default to zero
  following: [] // set default to zero
});

module.exports = mongoose.model("User", userSchema);