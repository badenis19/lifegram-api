const express = require('express');
const { ApolloServer, gql, AuthenticationError } = require('apollo-server-express');
const mongoose = require("mongoose");
const cors = require("cors");
const schema = require('./graphql/schema')
const resolvers = require('./graphql/resolvers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserDb = require('./models/user');


require("dotenv/config");

const port = process.env.PORT || 4001;

const app = express();

app.use(cors());

////////////////////////////////////////

app.use(express.urlencoded({
  extended: true
}));

/* APOLLO SERVER  */

const context = ({ req }) => {
  const token = req.headers.authorization || '';

  console.log(token)

  try {
    // check if token and Secret key are correct, if so return in context else return error
    const { id, email } = jwt.verify(token, process.env.SECRET_KEY);
    return {
      id,
      email
    }
  } catch (e) {
    throw new AuthenticationError(
      'Authentication token is invalid, please log in',
    )
  }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context
});

server.applyMiddleware({ app, path: '/graphql' });

// post request to signin/ path
app.post('/signIn', async (req, res) => {
  // using destructuring to extract email and password from the body
  const { email, password } = req.body

  console.log("email:", email)
  console.log("password", password)

  // getting the right users details by checking the emails
  // const theUser = await UserDb.find(user => user.email === email)
  const theUser = await UserDb.find({ email: email })

  console.log("user", theUser)
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  
  // if email does not match return error message 
  if (!theUser) {
    console.log("email not found")
    res.status(404).send({
      success: false,
      message: `Could not find account: ${email}`,
    }) 
  } else {
    console.log(theUser[0].username)
  }

  // check if password provided matches the user one
  const match = await bcrypt.compare(password, theUser[0].password)

  console.log("match?", match)
  if (!match) {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    //return error to user to let them know the password is incorrect
    console.log("wrong creds found")
    res.status(401).send({
      success: false,
      message: 'Incorrect credentials',
    })
  } else {
    console.log("correct creds found")
  }

  // if password matches we generate the token using the jwt.sign()
  const token = jwt.sign(
    { email: theUser.email, id: theUser.id },
    process.env.SECRET_KEY
    // ,{ expiresIn: 60 * 60 } expire
  )

  if (token) {
    console.log("token:", token)
  } else {
    console.log("no token")
  }

  // // If all goes well send the token to the client as part of the response
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

/* SERVER CONNECTION */
app.listen(port, () =>
  console.log(`listening to port`, process.env.PORT)
);
