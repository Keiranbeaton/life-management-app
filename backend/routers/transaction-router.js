'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('transactionRouter');
const Transaction = require('../models/transaction');
const User = require('../models/user');
const transactionFormatter = require('../lib/transaction-format');

let transactionRouter = module.exports = exports = new Router();

transactionRouter.post('/', jsonParser, function(req, res, next) {
    debug('POST /api/transaction');
    User.findById(req.body.userId)
      .then(user => {
        user.addTransaction(req.body)
          .then((trans) => {
            let data = trans.populate('category subcategory vendor');
            res.json(data);
          }).catch(next);
      }).catch(err => next(createError(400, err.message)));
});

transactionRouter.get('/', function(req, res, next) {
  debug('GET /api/transaction');
  Transaction.find().then(trans => res.send(trans)).catch(next);
});

transactionRouter.get('/:id', function(req, res, next) {
  debug('GET /api/transaction/:id');
  Transaction.findById(req.params.id).then(trans => res.send(trans)).catch(err => next(createError(400, err.message)));
});

transactionRouter.put('/:id', jsonParser, function(req, res, next) {
  debug('PUT /api/transaction/:id');
  Transaction.findByIdAndUpdate(req.params.id, req.body, {new: true}).then(trans => res.send(trans)).catch(next);
});

transactionRouter.delete('/:id', function(req, res, next) {
  debug('DELETE /api/transaction/:id');
  Transaction.findById(req.params.id)
    .then(trans => {
      return User.findById(trans.userId);
    })
    .then(user => {
      return user.removeTransactionById(req.params.id);
    })
    .then(trans => res.json(trans))
    .catch(next);
});
