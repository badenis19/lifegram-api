const { gql } = require('apollo-server-express');

const schema = gql(`

  type Query {
    users: [User]
    user(_id: ID!): User!
    posts: [Post!]!
    post(_id: ID!): Post!
    todos: [Todo]
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

  type User_ {
    id: ID!
    email: String!
    name: String!
    password: String!
  }

  type Todo {
    id: ID!
    user: Int!
    name: String!
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
  }

`);

module.exports = schema;