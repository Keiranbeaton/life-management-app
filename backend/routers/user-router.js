'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const User = require('../models/user');
const Vendor = require('../models/vendor');
const Transaction = require('../models/transaction');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const debug = require('debug')('userRouter');
const transactionFormatter = require('../lib/transaction-format');

let userRouter = module.exports = exports = Router();

userRouter.get('/', (req, res, next) => {
  debug('GET /api/user');
  User.find().populate('vendors categories subcategories transactions').then((users) => {
    res.send(users);
  }).catch(next);
});

userRouter.get('/:id', (req, res, next) => {
  debug('GET /api/user/:id');
  User.findById(req.params.id).populate('categories subcategories transactions vendors').then((user) => {
    res.send(user);
  }).catch((err) => {
    next(createError(404, err.message));
  });
});

userRouter.get('/transactions/:id', (req, res, next) => {
  debug('GET /api/user/transactions/:id');
  User.findById(req.params.id).populate('vendors').populate({path: 'categories', populate: {path: 'subcategories'}}).populate({path: 'transactions', populate: {path: 'vendor category subcategory'}}).then((user) => {
    if(user.transactions.length > 0) {
      Transaction.find({userId: req.params.id}).populate('vendor category subcategory').then((trans) => {
        let formatted = transactionFormatter.format(trans);
        res.send({transactions: formatted, user: user});
      }).catch(err => next(createError(400, err.message)));
    } else {
      res.send({transactions: transactionFormatter.return, user: user});
    }
  }).catch(err => next(createError(404, err.message)));
});

userRouter.put('/:id', jsonParser, (req, res, next) => {
  debug('PUT /api/user/:id');
  if(Object.keys(req.body).length === 0) return next(createError(400, 'No data sent with request'));
  User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(user => res.send(user)).catch(next);
});

userRouter.delete('/:id', (req, res, next) => {
  debug('DELETE /api/user/:id');
  let result;
  User.findByIdAndRemove(req.params.id)
    .then(user => {
      result = user;
      Transaction.remove({userId: user._id});
      Vendor.remove({userId: user._id});
      Category.remove({userId: user._id});
      Subcategory.remove({userId: user._id});
    })
    .then(() => {
      res.json(result);
    }).catch(next);
});
