'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const Promise = require('bluebird');
const Subcategory = require('./subcategory');

var categorySchema = mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true},
  name: {type: String, required: true},
  subcategories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory'}]
});

categorySchema.methods.addSubcategory = function(data) {
  let result;
  return new Promise((resolve, reject) => {
    if (!data.name) return reject(createError(400, 'Subcategories require a name'));
    new Subcategory(data).save()
      .then(sub => {
        result = sub;
        this.subcategories.push(sub._id);
        return this.save();
      })
      .then(() => resolve(result))
      .catch(reject);
  });
};

categorySchema.methods.removeSubcategoryById = function(subId) {
  return new Promise((resolve, reject) => {
    this.subcategories.filter(value => {
      if(value === subId) return false;
      return true;
    });
    this.save()
      .then(() => {
        return Subcategory.findByIdAndRemove(subId);
      })
      .then(sub => resolve(sub))
      .catch(reject);
  });
};

module.exports = exports = mongoose.model('Category', categorySchema);
