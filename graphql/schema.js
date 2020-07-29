const { gql } = require('apollo-server-express');

const schema = gql(`

  type Query {
    users: [User]
    user(_id: ID!): User!
    posts: [Post!]!
    post(_id: ID!): Post!
    myProfile: User
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    img: String
    age: Int
    description: String
    followers: [ID]
    following: [ID]
    posts: [Post]
  }
  
  type Post {
    _id: ID!
    description: String
    img: String
    comments: [String]
    likes: Int
    timeStamp: String 
    user: User
  }

  type Mutation {
    createPost(description: String, img: String, userId: String): Post
    createUser(username: String, email: String, password: String, img: String, age: Int, description: String, followers: [ID], following: [ID]): User
    updateLike(_id: ID!, likes: Int): Post
    followUser(_id: String, following: [String]): User
  }

`);

module.exports = schema;