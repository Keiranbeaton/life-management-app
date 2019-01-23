'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const User = require('../models/user');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const BasicHttp = require('../lib/basic-http');
const jwtAuth = require('../lib/jwt-auth');
const HandleError = require('../lib/handle-error');
const addDefaults = require('../lib/add-defaults');
const debug = require('debug')('authRouter');

let authRouter = module.exports = exports = Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  debug('POST api/signup');
  let newUser = new User();
  newUser.name.first = req.body.firstName;
  newUser.name.last = req.body.lastName;
  newUser.basic.email = req.body.email;
  newUser.generateHash(req.body.password)
    .then((tokenData) => {
      newUser.save().then((userReturn) => {
        tokenData.username = userReturn.basic.email;
        tokenData.userId = userReturn._id;
        res.json(tokenData);
        // addDefaults.add(userReturn);
      }, HandleError(400, next, 'Bad Request'));
    }, HandleError(500, next, 'Username already in use'));
});

authRouter.get('/login', BasicHttp, (req, res, next) => {
  debug('GET /api/login');
  User.findOne({'basic.email': req.auth.email})
    .then((user) => {
      if (!user) return next(createError(404, 'User not found'));
      user.comparePassword(req.auth.password)
        .then((tokenData) => {
          tokenData.userId = user._id;
          res.json(tokenData);
        }, HandleError(401, next, 'Authentication Failed'));
    }, HandleError(401, next, 'Authentication Failed'));
});
