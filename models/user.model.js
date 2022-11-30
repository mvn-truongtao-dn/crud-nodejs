var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
  token: { type: String },
});
schema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
schema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('User', schema);
