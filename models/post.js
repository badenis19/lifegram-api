const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  description: {type: String, maxlength: 100},
  img: { type: String, default: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTH4d1ldfiI0npUaDbUXnRHjumUJmSpIaKErA&usqp=CAU"},
  comments: {type: [], default: []},
  likes: {type: Number, default: 0},
  timeStamp: { type: Date, default: Date.now },
  userId: String
});

module.exports = mongoose.model("Post", postSchema);