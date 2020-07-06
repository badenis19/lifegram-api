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
    // return Post.findById(args._id);
    return Post.findById(args._id).populate('user').then(post => post).catch(err => err);
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

// const PostDB = require('../models/post');
// const UserDB = require('../models/user');

// const resolver = {
//   // Queries

//   // get all posts
//   posts: () => {
//     return PostDB.find();
//   },
//   // get a specific post based on id
//   // post: (args) => {
//   //   return PostDB.findById(args._id);
//   // },
//   post: (args) => {
//     console.log(args)
//     return PostDB.findById(args.id);//.populate('user').then(post => post).catch(err => err);
//   },
//   // get all users
//   users: () => {
//     return UserDB.find();
//   },
//   // get a specific user based on id
//   user: (args) => {
//     return UserDB.findById(args._id);
//   }
//   // user: {
//   //   posts: (user) => {
//   //     console.log("user._id")
//   //     return PostDB.find({ userId: user._id })
//   //   }
//   // }
// };

// module.exports = resolver;