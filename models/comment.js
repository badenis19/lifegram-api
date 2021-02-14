const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  description: {type: String, maxlength: 50},
  userId: { type: String }
});

module.exports = mongoose.model("Post", commentSchema);