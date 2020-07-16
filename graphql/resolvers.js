const PostDb = require('../models/post');
const UserDb = require('../models/user');

const todos = [
  {
    id: 1,
    user: 1,
    name: 'Do something'
  },
  {
    id: 2,
    user: 1,
    name: 'Do something else'
  },
  {
    id: 3,
    user: 2,
    name: 'Remember the milk'
  }
];

const resolvers = {
  Query: {
    posts: async (parent, args) => {
      return await PostDb.find({});
    },

    post: async (parent, args) => {
      return await PostDb.findById(args._id);
    },

    users: async (parent, args, context) => {
      return await UserDb.find();
    },

    user: async (parent, args) => {
      return await UserDb.findById(args._id);
    },
    // To remove
    todos: async (root, args, context) => {
      return await todos.filter(todo => todo.user === context.id)
    },
    myProfile: async (parent, args, context) => {
      // console.log("::::::::",context.id)
      // console.log(await UserDb.findById(context.id))
      return await UserDb.findById(context.id);
    },
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
      return newPost.save()
    },

    createUser: async (parent, args) => {
      console.log("creating user...")
      console.log(args)
      let newUser = new UserDb({
        username: args.username,
        email: args.email,
        password: args.password,
        img: args.img,
        age: args.age,
        description: args.description,
        followers: args.followers,
        following: args.following
      })
      return newUser.save()
    }

  }
};

module.exports = resolvers;