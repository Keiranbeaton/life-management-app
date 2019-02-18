'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('categoryRouter');

const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Transaction = require('../models/transaction');
const User = require('../models/user');

let categoryRouter = module.exports = exports = new Router();

categoryRouter.post('/', jsonParser, function(req, res, next) {
  debug('POST /api/category');
  let data = req.body;
  User.findById(data.userId)
    .then(user => {
      user.addCategory(req.body)
        .then((cat) => {
          res.json(cat);
        }).catch(next);
    }).catch(err => next(createError(err.status, err.message)));
});

categoryRouter.get('/:id', function(req, res, next) {
  debug('GET /api/category/:id');
  Category.findById(req.params.id)
    .then(cat => res.send(cat)).catch(err => next(createError(404, err.message)));
});

categoryRouter.get('/user/:userId', function(req, res, next) {
  debug('GET /api/category/user/:userId');
  Category.find({userId: req.params.userId})
    .then(cat => res.send(cat)).catch(err => next(createError(404, err.message)));
});

categoryRouter.put(':/id', jsonParser, function(req, res, next) {
  debug('PUT /api/category/:id');
  Category.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(cat => res.send(cat)).catch(next);
});

categoryRouter.delete('/:id', function(req, res, next) {
  debug('DELETE /api/category/:id');
  let transactionArray = [];
  let userId = '';
  let userTransactions = [];
  Category.findById(req.params.id)
    .then(cat => {
      userId = cat.userId;
      return User.findById(userId);
    })
    .then(user => {
      userTransactions = user.transactions;
      return user.removeCategoryById(req.params.id);
    })
    .then(cat => {
      Subcategory.deleteMany({supercategory: cat._id});
      Transaction.find({category: cat._id})
        .then(trans => {
        transactionArray = trans.map(obj => obj._id);
        Transaction.deleteMany({category: cat._id});
        userTransactions = userTransactions.filter((trans) => {
          if (transactionArray.indexOf(trans) === -1) {
            return true;
          }
          return false;
        });
        User.findOneAndUpdate({_id: userId}, {transactions: userTransactions});
        res.json(cat);
      });
    })
    .catch(next);
});
