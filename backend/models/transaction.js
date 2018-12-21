'use strict';

const mongoose = require('mongoose');

let transactionSchema = mongoose.Schema({
  userId: {type:mongoose.Schema.Types.ObjectId, required: true},
  date: {
    day: {type: Number, required: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true}
  },
  value: {type: Number, required: true},
  vendor: {type: String, required: true},
  category: {type: String, required: true},
  description: String
});

module.exports = exports = mongoose.model('Transaction', transactionSchema);
