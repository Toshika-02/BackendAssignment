 const express = require("express");
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerJs = require('swagger-jsdoc');

const route = require("./routes/route.js");
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js project',
      version: '3.0.0',
    },
     servers: [
      {
        url: 'http://localhost:3000/'
      }
     ]
  },
  apis: ['./Controller/*.js', './routes/*.js'],
}

const swaggerSpec = swaggerJs(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)) 

mongoose
  .connect(
    "mongodb+srv://toshika:MyProject@cluster0.dr0wqf4.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});





