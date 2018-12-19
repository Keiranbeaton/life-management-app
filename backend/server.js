'use strict';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Promise = require('bluebird');
const createError = require('http-errors');
const debug = require('debug')('server');
const cors = require('cors');

process.env.APP_SECRET = 'dev';
const port = process.env.PORT || 3000;
const mongoDbUri = process.env.MONGODB_URI || 'mongodb://localhost/lifeappdev';

mongoose.Promise = Promise;
mongoose.connect(mongoDbUri);

app.use(express.static(`${__dirname}/build`));

app.use(cors());

app.all('*', function(req, res, next) {
  debug('app.all 404 route');
  next(createError(404, `Error: ${req.method} :: ${req.url} is not a route`));
});

app.listen(port, function() {
  debug(`server up :: ${port}`);
});
