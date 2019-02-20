'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('vendorRouter');

const Vendor = require('../models/vendor');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const transactionFormatter = require('../lib/transaction-format');

let vendorRouter = module.exports = exports = new Router();

vendorRouter.post('/', jsonParser, function(req, res, next) {
  debug('POST /api/vendor');
  let data = req.body;
  User.findById(data.userId)
    .then(user => {
      user.addVendor(req.body)
        .then(vendor => res.json(vendor))
        .catch(next);
    }).catch(err => next(createError(404, err.message)));
});

vendorRouter.get('/', function(req, res, next) {
  debug('GET /api/vendor');
  Vendor.find().then(vendors => res.send(vendors)).catch(next);
});

vendorRouter.get('/:id', function(req, res, next) {
  debug('GET /api/vendor/:id');
  Vendor.findById(req.params.id)
    .then(vendor => res.send(vendor))
    .catch(err => next(createError(404, err.message)));
});

vendorRouter.get('/user/:userId', function(req, res, next) {
  debug('GET /api/vendor/user/:userId');
  Vendor.find({userId: req.params.userId})
    .then(vendor => res.send(vendor))
    .catch(err => next(createError(404, err.message)));
})

vendorRouter.put('/:id', jsonParser, function(req, res, next) {
  debug('PUT /api/vendor/:id');
  Vendor.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(vendor => res.send(vendor))
    .catch(next);
});

vendorRouter.delete('/:id', function(req, res, next) {
  debug('DELETE /api/vendor/:id');
  let userId = '';
  let userTransactions = [];
  let transactionArray = [];
  Vendor.findById(req.params.id)
    .then(ven => {
      userId = ven.userId;
      return User.findById(ven.userId);
    })
    .then(user => {
      return user.removeVendorById(req.params.id);
    })
    .then((vendor) => {
      Transaction.find({vendor: vendor._id}).then((transArray) => {
        transactionArray = transArray.map(trans => trans._id);
        Transaction.deleteMany({vendor: vendor._id}).then(() => {
          User.findById(userId).then((user) => {
            userTransactions = user.transactions.filter((trans) => {
              if (transactionArray.indexOf(trans) === -1) {
                return true;
              }
              return false;
            });
            User.findOneAndUpdate({_id: userId}, {transactions: userTransactions}, {new: true}).then((userFinal) => {
              Transaction.find({userId: userFinal._id}).populate('vendor category subcategory').then((transFinal) => {
                if (transFinal.length > 0) {
                  let formatted = transactionFormatter.format(transFinal);
                  res.json({transactions: formatted, vendor: vendor, user: userFinal});
                }
              }).catch(err => next(createError(400, err.message)));
            }).catch(err => next(createError(400, err.message)));
          }).catch(err => next(createError(400, err.message)));
        }).catch(err => next(createError(400, err.message)));
      }).catch(err => next(createError(400, err.message)));
    })
    .catch(next);
});
