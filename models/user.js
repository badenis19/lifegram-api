const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  age: Number,
  description: String,
  followers: [],
  following: [],
  posts: []
});

module.exports = mongoose.model("User", userSchema);