'use strict';

const app = require('express')();
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwtAuth = require('../lib/jwt-auth');
const userRouter = require('../routers/user-router');
const authRouter = require('../routers/auth-router');
const vendorRouter = require('../routers/vendor-router');
const categoryRouter = require('../routers/category-router');
const subcategoryRouter = require('../routers/subcategory-router');
const transactionRouter = require('../routers/transaction-router');

mongoose.connect('mongodb://localhost/test');

app.use(morgan('dev'));
app.use('/api', authRouter);
app.use('/api/user', userRouter);
app.use('/api/vendor', vendorRouter);
app.use('/api/category', categoryRouter);
app.use('/api/subcategory', subcategoryRouter);
app.use('/api/transaction', transactionRouter);

app.get('/api/jwtAuth', jwtAuth, function(req, res) {
  res.json({msg: 'Success'});
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).json(err.message);
});

app.listen(5000, function() {
  console.log('test server listening on 5000');
});
