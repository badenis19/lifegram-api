const PostDb = require('../models/post');
const UserDb = require('../models/user');
const bcrypt = require('bcrypt');
const { argsToArgsConfig } = require('graphql/type/definition');
// const { findById } = require('../models/post');

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
    myProfile: async (parent, args, context) => {
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
      return await UserDb.findById(post.userId);
    }
  },

  Mutation: {

    createPost: async (parent, args, context) => {
      let newPost = new PostDb({
        description: args.description,
        img: args.img,
        userId: context.id
      })
      return newPost.save((err, data) => {
        if (err) return console.error(err);
        console.log("Post created successfully!");
      })
    },

    createUser: async (parent, args) => {
      let newUser = new UserDb({
        username: args.username,
        email: args.email,
        password: bcrypt.hashSync(args.password, 4),
        img: args.img,
        age: args.age,
        description: args.description,
        followers: args.followers,
        following: args.following
      })
      return newUser.save((err, data) => { // data containes th user object
        if (err) return console.error(err);
        console.log("User created successfully!");
      });
    },

    followUser: async (parent, { following, _id }, context) => {
      // TO DO: add condition so that same user cannot be added twice + do Unfollow user resolver
      // add id of account followed in user user following array
      await UserDb.updateOne(
        {
          _id: context.id
        },
        {
          $push: {
            following: _id
          }
        }
      )
      // add id of follower to account followed
    //   await UserDb.updateOne(
    //     {
    //       _id: _id
    //     },
    //     {
    //       $push: {
    //         follower: context.id
    //       }
    //     }
    //   )
    }




    // followUser: async (parent, args, context) => {
    //   // get the ID or name of user
    //   console.log(context) // user logged in 
    //   console.log(args._id) // id of user to follow 

    //   const user = await UserDb.findById(context.id);
    //   // console.log(user)
    //   if (!user) {
    //     throw new Error(`Couldn’t find author with id ${context.id}`);
    //   }
    //   console.log("user added")
    //   user.following.push(args._id); 
    //   console.log(user)
    //   return  ;
    // }

    // // Update
    // updateLike: async (parent, args, context) => {
    //   console.log("args")
    //   // return await UserDb.findById(context.id);
    // },

  }
};

module.exports = resolvers;