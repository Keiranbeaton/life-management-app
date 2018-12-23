'use strict';

const mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
  name: {type: String, required: true}
});

module.exports = exports = mongoose.model('Category', categorySchema);
