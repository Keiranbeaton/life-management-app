'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('subcategoryRouter');

const Subcategory = require('../models/subcategory');
const Category = require('../models/category');
const Transaction = require('../models/transaction');
const User = require('../models/user');
const transactionFormatter = require('../lib/transaction-format');

let subcategoryRouter = module.exports = exports = new Router();

subcategoryRouter.post('/', jsonParser, function(req, res, next) {
  debug('POST /api/subcategory/');
  let data = req.body;
  Category.findById(data.supercategory)
    .then(cat => {
      cat.addSubcategory(req.body)
        .then((sub) => {
          User.findById(data.userId)
            .then(user => {
              user.addSubcategory(req.body)
              .then((subcat) => {
                res.json(sub);
              }).catch(next);
            }).catch(err => next(createError(400, err.message)));
        }).catch(next);
    }).catch(err => next(createError(400, err.message)));
});

subcategoryRouter.get('/', function(req, res, next) {
  debug('GET /api/subcategory/');
  Subcategory.find().then(sub => res.send(sub)).catch(next);
});

subcategoryRouter.get('/:id', function(req, res, next) {
  debug('GET /api/subcategory/:id');
  Subcategory.findById(req.params.id)
    .then(sub => res.send(sub)).catch(err => next(createError(404, err.message)));
});

subcategoryRouter.get('/user/:userId', function(req, res, next) {
  debug('GET /api/subcategory/user/:userId');
  Subcategory.find({userId: req.params.userId})
    .then(sub => res.send(sub)).catch(err => next(createError(404, err.message)));
});

subcategoryRouter.put('/:id', jsonParser, function(req, res, next) {
  debug('PUT /api/subcategory/:id');
  Subcategory.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(sub => res.send(sub)).catch(next);
});

subcategoryRouter.delete('/:id', function(req, res, next) {
   debug('DELETE /api/subcategory/:id');
   let transactionArray = [];
   let userId = '';
   let userTransactions = [];
   Subcategory.findById(req.params.id)
    .then(sub => {
      return Category.findById(sub.supercategory);
    })
    .then(cat => {
      userId = cat.userId;
      return cat.removeSubcategoryById(req.params.id);
    })
    .then(sub => {
      Transaction.find({subcategory: sub._id}).then((transArray) => {
        transactionArray = transArray.map(trans => trans._id);
        Transaction.deleteMany({subcategory: sub._id}).then(() => {
          User.findById(userId).then((user) => {
            userTransactions = user.transactions.filter((trans) => {
              if (transactionArray.indexOf(trans) === -1) {
                return true;
              }
              return false;
            });
            User.findOneAndUpdate({_id: userId}, {transactions: userTransactions}, {new: true}).then((user) => {
              Transaction.find({userId: user._id}).populate('vendor category subcategory').then((transFinal) => {
                if (transFinal.length > 0) {
                  let formatted = transactionFormatter.format(transFinal);
                  res.json({transactions: formatted, subvategory: sub});
                }
              }).catch(err => next(createError(400, err.message)));
            }).catch(err => next(createError(400, err.message)));
          }).catch(err => next(createError(400, err.message)));
        }).catch(err => next(createError(400, err.message)));
      }).catch(err => next(createError(400, err.message)));
    })
    .catch(next);
});
