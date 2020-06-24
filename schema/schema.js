import graphql from 'graphql';

/* MODELS */
import User from '../models/user';
import Post from '../models/post';

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
    comments: { type: GraphQLList },
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
    followers: { type: GraphQLList },
    following: { type: GraphQLList },
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
      resolve(parent, args) { // acts after receivin query. 'parent' used with relationships | 'args' is the args key just above so 'id'
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
        return Post.find({}) // when object is empty {} it will return all
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


// Defining which query the user can use when making queries from the front-end
module.exports = new GraphQLSchema({
  query: RootQuery
  // , // allows make queries using query 
  // mutation: Mutation // allows to perform mutation using mutation 
})
