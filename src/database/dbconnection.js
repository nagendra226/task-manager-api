const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect(
  process.env.MONGODB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

module.exports = { mongoose, validator};
