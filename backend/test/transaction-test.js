'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const Transaction = require('../models/transaction');
const User = require('../models/user');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Vendor = require('../models/vendor');
const baseUrl = 'localhost:5000/api/vendor';
chai.use(chaiHttp);

describe('Transaction Tests', function() {
  let user;
  let transaction;
  let vendor;
  let subcategory;
  let category;
  before(function(done) {
    user = new User({name: {first: 'TransactionFirst', last: 'TransactionLast'}, basic: {email: 'TransactionEmail@test.com', password: 'TransactionPassword'}});
    user.save().then((userData) => {
      this.user = userData;
      vendor = new Vendor({name: 'TransactionVendor', userId: user._id});
      vendor.save().then((vendorData) => {
        this.vendor = vendorData;
        category = new Category({name: 'TransactionCategory', userId: user._id});
        category.save().then((categoryData) => {
          this.category = categoryData;
          subcategory = new Subcategory({name: 'TransactionSubcategory', userId: user._id, supercategory: category._id});
          subcategory.save().then((subcategoryData) => {
            this.subcategory = subcategoryData;
            transaction = new Transaction({userId: user._id, date: new Date(), amount: 10, vendor: vendor._id, category: category._id, subcategory: subcategory._id, isSubscription: false});
            transaction.save().then((transactionData) => {
              this.transaction = transactionData;
              done();
            }, (err) => {throw err;});
          }, (err) => {throw err;});
        }, (err) => {throw err;});
      }, (err) => {throw err;});
    }, (err) => {throw err;});
  });

  it('POST new transaction', function(done) {
    chai.request(baseUrl)
      .post('/')
      .send({date: new Date(), userId: user._id, amount: 20, vendor: vendor._id, category: category._id, subcategory: subcategory._id, isSubscription: false})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('userId');
        expect(res.body.userId).to.eql(user._id);
        expect(res.body).to.have.property('date');
        expect(res.body).to.have.property('amount');
        expect(res.body.amount).to.eql(20);
        expect(res.body).to.have.property('category');
        expect(res.body.category).to.eql(category._id);
        expect(res.body).to.have.property('subcategory');
        expect(res.body.subcategory).to.eql(subcategory._id);
        expect(res.body).to.have.property('isSubscription');
        expect(res.body.isSubscription).to.eql(false);
        expect(res.body).to.have.property('vendor');
        expect(res.body.vendor).to.eql(vendor._id);
        done();
      });
  });

  it('GET all subcategories associated with userId', function(done) {
    chai.request(baseUrl)
      .get('/user/' + user._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        console.log('res.body', res.body);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('userId');
        expect(res.body.userId).to.eql(user._id);
        expect(res.body).to.have.property('vendor');
        expect(res.body).to.have.property('amount');
        expect(res.body).to.have.property('category');
        expect(res.body).to.have.property('subcategory');
        expect(res.body).to.have.property('isSubscription');
        expect(res.body).to.have.property('date');
        done();
      });
  });

  it('GET bad :userId', function(done) {
    chai.request(baseUrl)
      .get('/user/badid')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(404);
        done();
      });
  });

  it('DELETE :id', function(done) {
    chai.request(baseUrl)
      .delete('/' + subcategory._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        done();
      });
  });
});
