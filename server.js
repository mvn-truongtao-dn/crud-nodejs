const express = require('express');
const mongoose = require('mongoose');
const productRouter = require('./routes/productRoutes.js');
const userRouter = require('./routes/userRoutes.js');

const bodyParser = require('body-parser');

const app = express();

require('dotenv').config();
app.use(express.json());
app.use(bodyParser.json());

mongoose
  .connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Connected to the database ');
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });

app.use(productRouter);
app.use(userRouter);

app.listen(3000, () => {
  console.log('Server is running...');
});
