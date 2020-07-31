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
  let newUser = new UserDb({
    username: username,
    email: email,
    password: bcrypt.hashSync(password, 4),
    age: age
  })

  return newUser.save((err, data) => {
    if (err) return console.error(err);
    console.log("User added successfully!", data);
  });
});

// post request to signin/ path
app.post('/signIn', async (req, res) => {

  // using destructuring to extract email and password from the body
  const { email, password } = req.body

  // getting the right users details by checking the emails
  const theUser = await UserDb.find({ email: email })

  // if email does not match return error message 
  if (!theUser) {
    console.log("email not found")
    res.status(404).send({
      success: false,
      message: `Could not find account: ${email}`,
    })
  }

  // check if password provided matches the user one
  const match = await bcrypt.compare(password, theUser[0].password)

  if (!match) {
    //return error to user to let them know the password is incorrect
    // console.log("wrong creds found")
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
