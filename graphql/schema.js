const { buildSchema } = require('graphql');
const schema = buildSchema(`

  type Query {
    users: [User!]!
    user(id: ID!): User!
    posts: [Post!]!
    post(id: ID!): Post!
  }

  type User {
    id: ID!
    name: String!
    password: String!
    img: String
    age: Int
    description: String
    followers: [ID]
    following: [ID]
  }

  type Post {
    id: ID!
    description: String!
    img: String
    comments: [String]
    likes: Int
    timeStamp: String 
    user: User
  }
`);
module.exports = schema;
