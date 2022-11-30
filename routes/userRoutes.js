const User = require('../models/user.model.js');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var randtoken = require('rand-token');

const app = express();
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).json({
        message: 'All input is required',
      });
    }
    console.log(email);
    console.log(password);

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).json('User Already Exits. Please Login');
    }
    encryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email,
      password: encryptedPassword,
    });

    const token = jwt.sign(
      {
        user_id: user._id,
        email,
      },
      randtoken.generate(16),
      {
        expiresIn: '2h',
      }
    );
    user.token = token;
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});
app.post('/login', async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send('All input is required');
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        randtoken.generate(16),
        {
          expiresIn: '2h',
        }
      );

      // save user token
      user.token = token;

      // user
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(user);
    }
    return res.status(400).send('Invalid Credentials');
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
