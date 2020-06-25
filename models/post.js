const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  description: {type: String, maxlength: 100},
  img: String,
  comments: {type: [], default: []},
  likes: {type: Number, default: 0},
  timeStamp: { type: Date, default: Date.now },
  userId: String
});

module.exports = mongoose.model("Post", postSchema);