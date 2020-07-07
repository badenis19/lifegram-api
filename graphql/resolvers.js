const PostDb = require('../models/post');
const UserDb = require('../models/user');

const resolvers = {
  Query: {
    posts: async (parent, args) => {
      return await PostDb.find({});
    },

    post: async (parent, args) => {
      return await PostDb.findById(args._id);
    },

    users: async (parent, args) => {
      return await UserDb.find();
    },

    user: async (parent, args) => {
      return await UserDb.findById(args._id);
    }
  },

  User: {
    posts: async (user, args) => {
      return await PostDb.find({ userId: user._id });
    }
  },

  Post: {
    user: async (post, args) => {
      return await UserDb.findById(post.userId)
    }
  },

  Mutation: {
    createPost: async (parent, args) => {
      let newPost = new PostDb({
        description: args.description,
        img: args.img,
        userId: args.userId
      })
      
      console.log(">>", newPost)
      return newPost.save()
    }
  }
};

module.exports = resolvers;