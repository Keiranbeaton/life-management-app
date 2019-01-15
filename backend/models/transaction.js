'use strict';

const mongoose = require('mongoose');

let transactionSchema = mongoose.Schema({
  userId: {type:mongoose.Schema.Types.ObjectId, required: true},
  date: {type: Date, required: true},
  amount: {type: Number, required: true},
  vendor: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Vendor'},
  category: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category'},
  subcategory: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Subcategory'},
  text: String,
  isSubscription: {type: Boolean, required: true, default: false},
  subscriptionInterval: String
});

module.exports = exports = mongoose.model('Transaction', transactionSchema);
