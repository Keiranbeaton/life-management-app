'use strict';

const mongoose = require('mongoose');

let transactionSchema = mongoose.Schema({
  userId: {type:mongoose.Schema.Types.ObjectId, required: true},
  date: {
    day: {type: Number, required: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true}
  },
  time: {
    hours: Number,
    minutes: Number
  },
  amount: {type: Number, required: true},
  vendor: {type: mongoose.Schema.Types.ObjectId, required: true},
  category: {type: mongoose.Schema.Types.ObjectId, required: true},
  subcategory: {type: mongoose.Schema.Types.ObjectId},
  description: String,
  isSubscription: {type: Boolean, required: true, default: false}
});

module.exports = exports = mongoose.model('Transaction', transactionSchema);
