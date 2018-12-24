'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const User = require('../models/user');
// const BasicHttp = require('../lib/basic-http');
// const authzn = require('../lib/authorization');
// const jwtAuth = require('../lib/jwt-auth');
const debug = require('debug')('authRouter');

let authRouter = module.exports = exports = Router();
