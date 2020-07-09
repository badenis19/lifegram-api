const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require("mongoose");
const cors = require("cors");
const schema = require('./graphql/schema')
const resolvers = require('./graphql/resolvers');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require("dotenv/config");

const port = process.env.PORT || 4001;

const app = express();

app.use(cors());

////////////////////////////////////////

app.use(express.urlencoded({
  extended: true

}))

const users = [
  {
    _id: 1,
    email: 'br@df.ld',
    username: 'Bruno',
    password: 'fsfs',
    description: 'fitness addict',
    age: 29,
    followers: [],
    following: []
  },
  {
    _id: 2,
    email: 't@df.ld',
    username: 'Thierry',
    password: 'fsfsjh',
    description: 'Hi',
    age: 31,
    followers: [],
    following: []
  }
];

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
]

const SECRET_KEY = 'secret!'

// post request to login/ path
app.post('/login', async (req, res) => {
  // using destructuring to extract email and password from the body
  const { email, password } = req.body
  // getting the right users details by checking the emails
  const theUser = users.find(user => user.email === email)

  // if email does not match return error message 
  if (!theUser) {
    res.status(404).send({
      success: false,
      message: `Could not find account: ${email}`,
    })
    return
  }

  //check if password provided matches the user one
  const match = await bcrypt.compare(password, theUser.password)
  if (!match) {
    //return error to user to let them know the password is incorrect
    res.status(401).send({
      success: false,
      message: 'Incorrect credentials',
    })
    return
  }

  // if password matches we generate the token using the jwt.sign()
  const token = jwt.sign(
    { email: theUser.email, id: theUser.id },
    SECRET_KEY,
  )
  
  // If all goes well send the token to the client as part of the response
  res.send({
    success: true,
    token: token,
  })
})

////////////////////////////////////////

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
