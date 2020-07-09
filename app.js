const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require("mongoose");
const cors = require("cors");
const schema = require('./graphql/schema')
const resolvers = require('./graphql/resolvers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require("dotenv/config");

const port = process.env.PORT || 4001;

const app = express();

app.use(cors());

////////////////////////////////////////

app.use(express.urlencoded({
  extended: true
}))

const SECRET_KEY = 'secret!';

const users = [
  {
    id: 1,
    email: 'b',
    username: 'Bruno',
    password: '$2b$10$ahs7h0hNH8ffAVg6PwgovO3AVzn1izNFHn.su9gcJnUWUzb2Rcb2W',
    description: 'fitness addict',
    age: 29,
    followers: [],
    following: []
  },
  {
    id: 2,
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



// post request to signin/ path
app.post('/signIn', async (req, res) => {
  // using destructuring to extract email and password from the body
  const { email, password } = req.body

  console.log(email === users[0].email)
  console.log(password === users[0].password)
  // getting the right users details by checking the emails
  const theUser = users.find(user => user.email === email)
  
  console.log("user", theUser)
  
  // if email does not match return error message 
  if (!theUser) {
    console.log("email not found")
    res.status(404).send({
      success: false,
      message: `Could not find account: ${email}`,
    })
    return console.log("email found")
  }

  //check if password provided matches the user one
  const match = await bcrypt.compare(password, theUser.password)
  if (!match) {
    //return error to user to let them know the password is incorrect
    res.status(401).send({
      success: false,
      message: 'Incorrect credentials',
    })
    return console.log("correct creds found")
  }

  // if password matches we generate the token using the jwt.sign()
  const token = jwt.sign(
    { email: theUser.email, id: theUser.id },
    SECRET_KEY,
  )

  if (token){
    console.log("token")
  } else {
    console.log("no token")
  }

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
