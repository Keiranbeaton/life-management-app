'use strict';

const mongoose = require('mongoose');

let vendorSchema = mongoose.Schema({
  name: {type: String, required: true}
});

module.exports = exports = mongoose.model('Vendor', vendorSchema);
