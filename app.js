const express = require('express');
// const graphqlHTTP = require('express-graphql');
const mongoose = require("mongoose");
const cors = require("cors");
// const schema = require('./schema/schema')
require("dotenv/config");

const port = process.env.PORT || 4000;

const app = express();

app.use(cors());

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
