const express = require('express');
// const graphqlHTTP = require('express-graphql');
// const mongoose = require("mongoose");
const cors = require("cors");
// const schema = require('./schema/schema')
require("dotenv/config");


const port = process.env.PORT || 4000;

const app = express();

app.use(cors());

app.listen(port, () =>
  console.log(`listening to port`, process.env.PORT)
);
