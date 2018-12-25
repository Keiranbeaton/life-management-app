'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('categoryRouter');

const Category = require('../model/category');
const User = require('../model/user');

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
