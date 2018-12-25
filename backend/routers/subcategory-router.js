'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('subcategoryRouter');

const Subcategory = require('../model/subcategory');
const User = require('../model/user');

let subcategoryRouter = module.exports = exports = new Router();

subcategoryRouter.post('/', jsonParser, function(req, res, next) {
  debug('POST /api/subcategory/');
  let data = req.body;
  User.findById(data.userId)
    .then(user => {
      user.addSubcategory(req.body)
        .then((sub) => {
          res.json(sub);
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

subcategoryRouter.put('/:id', jsonParser, function(req, res, next) {
  debug('PUT /api/subcategory/:id');
  Subcategory.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(sub => res.send(sub)).catch(next);
});

// subcategoryRouter.delete('/:id', function(req, res, next) {
//   debug('DELETE /api/subcategory/:id');
// });
