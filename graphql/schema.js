const { buildSchema } = require('graphql');
const schema = buildSchema(`

  type Query {
    users: [User]
    user(_id: ID!): User!
    posts: [Post!]!
    post(_id: ID!): Post!
  }

  type User {
    _id: ID!
    username: String!
    password: String!
    img: String
    age: Int
    description: String
    followers: [ID]
    following: [ID]
    posts: [Post!]
  }

  type Post {
    _id: ID!
    description: String!
    img: String
    comments: [String]
    likes: Int
    timeStamp: String 
    user: User
  }
`);
module.exports = schema;