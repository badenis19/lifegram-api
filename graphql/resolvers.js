const PostDb = require('../models/post');
const UserDb = require('../models/user');
const bcrypt = require('bcrypt');

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
      console.log(args)
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
      console.log(args)
      let newUser = new UserDb({
        username: args.username,
        email: args.email,
        password: bcrypt.hashSync(args.password, 4),
        img: args.img,
        age: args.age,
        description: args.description,
        followers: args.followers,
        following: args.following,
        weight: args.weight,
        height: args.height
      })
      return newUser.save((err, data) => { // data containes th user object
        if (err) return console.error(err);
        console.log("User created successfully!");
      });
    },

    followUser: async (parent, { _id, username, img }, context) => {
      console.log(">>", username)
      console.log(">>", img)
      // condition so that same user cannot be added twice
      // getting the "following" array from the user to then check if already following
      let currentUser = await UserDb.findById(context.id);

      // if user not in following array add else return error in console
      if (!currentUser.following.includes(_id)) {
        try {
          console.log("following");
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
          await UserDb.updateOne(
            {
              _id: _id
            },
            {
              $push: {
                followers: context.id
              }
            }
          )
        } catch (err) {
          console.log(err)
        }
      }
      else {
        try {
          console.log("unfollowing");
          await UserDb.updateOne(
            {
              _id: context.id
            },
            {
              $pull: {
                following: _id
              }
            }
          )
          // remove id of follower from account followed
          await UserDb.updateOne(
            {
              _id: _id
            },
            {
              $pull: {
                followers: context.id
              }
            }
          )
        } catch (err) {
          console.log(err)
        }
      }
    },

    likePost: async (parent, { _id }, context) => {
      // if doesn't like the picture yet, like. else you already liked that picture
      let currentPost = await PostDb.findById(_id)
      console.log(currentPost);

      // if not liking yet 
      if (!currentPost.likes.includes(context.id)) {
        console.log("liking")
        try {
          await PostDb.updateOne(
            {
              _id: _id
            },
            {
              $push: {
                likes: context.id
              }
            }
          )
        } catch (err) {
          console.log(err)
        }
      } else {
        console.log("unliking")
        try {
          await PostDb.updateOne(
            {
              _id: _id
            },
            {
              $pull: {
                likes: context.id
              }
            }
          )
        } catch (err) {
          console.log(err)
        }
      }
    },

    editUserProfile: async (parent, { username, email, password, age, img, description, weight, height }, context) => {

      return UserDb.findByIdAndUpdate(
        {
          "_id": context.id
        },
        {
          "$set": {
            username: username,
            email: email,
            // password: bcrypt.hashSync(password, 4),
            img: img,
            age: age,
            description: description,
            weight: weight,
            height: height
          }
        },
        (err, data) => {
          if (err) console.log(err);
          console.log("User edited successfully")
        }
      )
    },

    deletePost: async (parent, { _id }) => {
      return PostDb.findByIdAndDelete(_id, (err, data) => {
        if (err) console.error(err)
        console.log("post deleted")
      });
    }

  }
};

module.exports = resolvers;