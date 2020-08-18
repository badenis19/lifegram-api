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

app.use(express.urlencoded({
  extended: true
}));

/* APOLLO SERVER  */

const context = ({ req }) => {
  const token = req.headers.authorization || '';

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
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context
});

server.applyMiddleware({ app, path: '/graphql' });

app.post('/sign', async (req, res) => {
  const { username, email, password, age } = req.body
  console.log("password", password)
  let newUser = new UserDb({
    username: username,
    email: email,
    password: bcrypt.hashSync(password, 4),
    age: age
  })

  if (newUser) {
    return newUser.save((error, data) => {
      if (error) {
        return res.status(400).send({
          success: false,
          message: `User not created, credentials already in use.`,
        })
      }
      res.status(200).send({
        message: "User created succesfully"
      })
      return newUser.save();
    });
  }
});

// post request to signin/ path
app.post('/signIn', async (req, res) => {

  // using destructuring to extract email and password from the body
  const { email, password } = req.body
  console.log(">>>", email);
  console.log("<<<<", password);

  // getting the right users details by checking the emails
  const theUser = await UserDb.find({ email: email })

  // if email does not match return error message 
  if (theUser.length <= 0) {
    console.log("email not found")
    return res.status(404).send({
      success: false,
      message: `Could not find account: ${email}`,
    })
  }

  // check if password provided matches the user one
  const match = await bcrypt.compare(password, theUser[0].password)
  console.log("--", match)

  if (!match) {
    //return error to user to let them know the password is incorrect
    res.status(401).send({
      success: false,
      message: 'Incorrect credentials',
    })
  }

  // if password matches we generate the token using the jwt.sign()
  const token = jwt.sign(
    { email: theUser[0].email, id: theUser[0]._id },
    process.env.SECRET_KEY
    // ,
    // { expiresIn: "1 hour" } 
  )

  // If all goes well send the token to the client as part of the response
  res.send({
    success: true,
    token: token,
  })
})

/* MONGODB CONNECTION */
mongoose.connect(
  process.env.URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("connected to mongodb 🥭")
);

/* SERVER CONNECTION */
app.listen(port, () =>
  console.log(`listening to port`, process.env.PORT)
);
