var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
  },
  
});
const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
