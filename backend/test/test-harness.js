'use strict';
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
process.env.APP_SECRET = 'testKey';
require('./test-server');
require('./auth-test');
require('./user-test');
require('./vendor-test');
require('./category-test');
require('./subcategory-test');
require('./transaction-test');
require('./transaction-formatter-test');
process.on('exit', (code) => {
  mongoose.connection.db.dropDatabase(() => console.log('db dropped ' + code));
});
