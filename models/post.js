const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  description: String,
  img: String,
  comments: [],
  likes: Number,
  timeStamp: { type: Date, default: Date.now },
  userId: String
});

module.exports = mongoose.model("Post", postSchema);