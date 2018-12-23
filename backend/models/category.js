'use strict';

const mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
  name: {type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId},
  superCategory: {type:mongoose.Schema.Types.ObjectId}
});

module.exports = exports = mongoose.model('Category', categorySchema);
