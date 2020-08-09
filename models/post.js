const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  description: {type: String, maxlength: 100},
  img: { type: String },
  comments: {type: [], default: []},
  likes: {type: [], default: []},
  timeStamp: { type: Date, default: Date.now },
  userId: { type: String }
});

module.exports = mongoose.model("Post", postSchema);