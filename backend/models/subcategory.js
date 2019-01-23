'use strict';

const mongoose = require('mongoose');

let subcategorySchema = mongoose.Schema({
  name: {type: String, required: true},
  supercategory: {type: mongoose.Schema.Types.ObjectId, required: true}
});

module.exports = exports = mongoose.model('Subcategory', subcategorySchema);
