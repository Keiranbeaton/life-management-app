'use strict';

const mongoose = require('mongoose');

let vendorSchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
  name: {type: String, required: true}
});

module.exports = exports = mongoose.model('Vendor', vendorSchema);
