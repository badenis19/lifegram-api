const Post = require('../models/post');
const User = require('../models/user');

const resolver = {
  // Queries

  // get all posts
  posts: () => {
    return Post.find();
  },
  // get a specific post based on id
  post: (args) => {
    return Post.findById(args._id);
  },
  // get all users
  users: () => {
    return User.find();
  },
  // get a specific user based on id
  user: (args) => {
    
    return User.findById(args._id);
  }
};

module.exports = resolver;