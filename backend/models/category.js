'use strict';

const mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
  name: {type: String, required: true},
  subcategories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory'}]
});

module.exports = exports = mongoose.model('Category', categorySchema);
