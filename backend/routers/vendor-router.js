'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('vendorRouter');

const Vendor = require('../models/vendor');
const User = require('../models/user');

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

vendorRouter.put('/:id', jsonParser, function(req, res, next) {
  debug('PUT /api/vendor/:id');
  Vendor.findByIdAndUpdate(req.params.id, req.body, {new:true})
    .then(vendor => res.send(vendor))
    .catch(next);
});

vendorRouter.delete('/:id', function(req, res, next) {
  debug('DELETE /api/vendor/:id');
  Vendor.findById(req.params.id)
    .then(ven => {
      return User.findById(ven.userId);
    })
    .then(user => {
      return user.removeVendorById(req.params.id);
    })
    .then(ven => res.json(ven))
    .catch(next);
});
