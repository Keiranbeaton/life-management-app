'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsontwebtoken');
const createError = require('http-errors');
const Promise = require('bluebird');
const Category = require('./category');
const Subcategory = require('./subcategory');
const Transaction = require('./transaction');
const Vendor = require('./vendor');

let userSchema = mongoose.Schema({
  basic: {
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  },
  name: {
    first: {type: String, required: true},
    last: {type: String, required: true}
  },
  vendors: [{type:mongoose.Schema.Types.ObjectId, ref: 'Vendor'}],
  transactions: [{type:mongoose.Schema.Types.ObjectId, ref: 'Transaction'}],
  categories: [{type:mongoose.Schema.Types.ObjectId, ref: 'Category'}],
  subcategories: [{type:mongoose.Schema.Types.ObjectId, ref:'Subcategory'}]
});

userSchema.methods.generateHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, (err, data) => {
      if (err) return reject(err);
      this.basic.password = data;
      resolve({token: jwt.sign({idd: this.basic.email}, process.env.APP_SECRET)});
    });
  });
};

userSchema.methods.comparePassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.basic.password, (err, data) => {
      if (err) return reject(err);
      if (data === false) return reject(new Error('Password did not match'));
      resolve({token: jwt.sign({idd: this.basic.email}, process.env.APP_SECRET)});
    });
  });
};

userSchema.methods.addVendor = function(data) {
    let result;
    return new Promise((resolve, reject) => {
      if (!data.name) return reject(createError(400, 'Vendors require a name'));
      new Vendor(data).save()
      .then(ven => {
        result = ven;
        this.vendors.push(ven._id);
        return this.save();
      })
      .then(() => resolve(result))
      .catch(reject);
    });
};

userSchema.methods.addTransaction = function(data) {
  let result;
  return new Promise((resolve, reject) => {
    if (!data.date.day || !data.date.month || !data.date.year ||) return reject(createError(400, 'Transactions require a date'));
    if (!data.amount) return reject(createError(400, 'Transactions require an amount'));
    if (!data.vendor) return reject(createError(400, 'Transactions require a vendor'));
    if (!data.category) return reject(createError(400, 'Transactions require a category'));
    new Transaction(data).save()
      .then(trans => {
        result = trans;
        this.transactions.push(trans._id);
        return this.save();
      })
      .then(() => resolve(result))
      .catch(reject);
  });
}

userSchema.methods.addCategory = function(data) {
  let result;
  return new Promise((resolve, reject) => {
    if (!data.name) return reject(createError(400, 'Categories require a name'));
    new Category(data).save()
      .then(cat => {
        result = cat;
        this.categories.push(cat._id);
        return this.save();
      })
      .then(() => resolve(result))
      .catch(reject);
  });
}

userSchema.methods.addSubcategory = function(data) {
  let result;
  return new Promise((resolve, reject) => {
    if (!data.name) return reject(createError(400, 'Subcategories require a name'));
    if (!data.supercategory) return reject(createError(400, 'Subcategories require a Supercategory'));
    new Subcategory(data).save()
      .then(sub => {
        result = sub;
        this.subcategories.push(sub._id);
        return this.save();
      })
      .then(() => resolve(result))
      .catch(reject);
  });
}

module.exports = exports = mongoose.model('User', userSchema);
