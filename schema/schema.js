const graphql = require('graphql');

/* MODELS */
const User = require('../models/user');
const Post = require('../models/post');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;


const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLID },
    description: { type: GraphQLString },
    img: { type: GraphQLString },
    comments: { type: GraphQLList(GraphQLString) },
    likes: { type: GraphQLInt },
    timeStamp: { type: GraphQLString }, //https://stackoverflow.com/questions/51830791/graphql-js-timestamp-scalar-type
    user: {
      type: UserType,
      resolve(parent, args) {
        // console.log(parent)
        return User.findById(parent.userId)
      }
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    age: { type: GraphQLInt },
    description: { type: GraphQLString },
    followers: { type: GraphQLList(GraphQLString) },
    following: { type: GraphQLList(GraphQLString) },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({ userId: parent.id })
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) { // acts after receiving query. 'parent' used with relationships | 'args' is the args key just above so 'id'
        return User.findById(args.id)
      }
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Post.findById(args.id)
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({})
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({})
      }
    }
  }
})

// Mutation allow to Create, Edit and Delete data
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        followers: { type: GraphQLList(GraphQLID) },
        following: { type: GraphQLList(GraphQLID) }
      },
      resolve(parent, args) {
        let user = new User({ 
          username: args.username,
          password: args.password,
          age: args.age,
          description: args.description,
          followers: args.followers,
          following: args.following
        })
        return user.save() 
      }
    },
    addPost: {
        type: PostType,
        args: {
            description: {type: new GraphQLNonNull(GraphQLString)}, 
            img: {type: new GraphQLNonNull(GraphQLString)},
            comments: { type: GraphQLList(GraphQLString) },
            likes: {type: GraphQLInt},
            timeStamp: {type: GraphQLString},
            userId: {type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parent,args){
            let post = new Post({
              description: args.description, 
              img: args.img,
              comments: args.comments,
              likes: args.likes,
              timeStamp: args.timeStamp,
              userId: args.userId
            })
            return post.save()
        }
    }
  }
})


// Defining which query the user can use when making queries from the front-end
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation 
})
