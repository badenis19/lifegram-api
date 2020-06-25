const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, maxlength: 20},
  password: {type: String, maxlength: 60},
  age: {type: Number, min: 16, max: 90},
  description: {type: String, maxlength: 50},
  followers: {type: [], default: []},
  following: {type: [], default: []}
});

module.exports = mongoose.model("User", userSchema);