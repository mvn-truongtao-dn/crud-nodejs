const express = require('express');
const mongoose = require('mongoose');
const productModel = require('../model');
const app = express();

app.get('/products', async (request, response) => {
  const users = await productModel.find();
  var title = request.query.title;

  try {
    if (title) {
      console.log(title);
      console.log(title.toLowerCase().split(' ').join(''));
      var search = new RegExp(title.toLowerCase().split(' ').join(''), 'i');
      var data = users.filter((item) =>
        //
        search.test(item)
      );
      console.log(data);
      response.send(data);
    } else response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post('/products', async (request, response) => {
  const product = new productModel({
    _id: mongoose.Types.ObjectId(),
    title: request.body.title,
  });
  return product
    .save()
    .then((newProduct) => {
      return response.status(201).json({
        success: true,
        message: 'New product created successfully',
        product: newProduct,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: error.message,
      });
    });
});

app.delete('/products/:productId', async (request, response) => {
  const id = request.params.productId;
  productModel
    .findByIdAndRemove(id)
    .then((product) => {
      response.status(200).json({
        success: true,
        message: 'Delete success',
        product: product,
      });
    })
    .catch((err) => {
      response.status(500).json({
        success: false,
        message: 'This product does not exit',
        error: err.message,
      });
    });
});

app.patch('/products/:productId', (request, response) => {
  const id = request.params.productId;
  const updateObject = request.body;
  productModel
    .update({ _id: id }, { $set: updateObject })
    .exec()
    .then(() => {
      response.status(200).json({
        success: true,
        message: 'update success',
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'server error. Please try again',
      });
    });
});

app.get('/products/:productId', (request, response) => {
  const id = request.params.productId;
  productModel
    .findById(id)
    .then((product) => {
      response.status(200).json({
        success: true,
        message: 'get success',
        product: product,
      });
    })
    .catch((err) => {
      response.status(500).json({
        success: false,
        message: 'server error',
      });
    });
});

module.exports = app;
