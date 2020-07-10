const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require("mongoose");
const cors = require("cors");
const schema = require('./graphql/schema')
const resolvers = require('./graphql/resolvers');
// const connectToDb = require('./db/connect');
const bcrypt = require('bcrypt');
require("dotenv/config");

const port = process.env.PORT || 4001;

const app = express();

app.use(cors());

let hash = bcrypt.hashSync("password1",4)

console.log(typeof hash)

/* MONGODB CONNECTION */
mongoose.connect(
  process.env.URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("connected to mongodb 🥭")
);

// connectToDb();

/* APOLLO SERVER  */

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });


/* SERVER CONNECTION */
app.listen(port, () =>
  console.log(`listening to port`, process.env.PORT)
);
