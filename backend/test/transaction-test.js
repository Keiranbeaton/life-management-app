'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const Transaction = require('../models/transaction');
const User = require('../models/user');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Vendor = require('../models/vendor');
const baseUrl = 'localhost:5000/api/transaction';
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
        expect(res.body).to.have.property('date');
        expect(res.body).to.have.property('amount');
        expect(res.body.amount).to.eql(20);
        expect(res.body).to.have.property('category');
        expect(res.body).to.have.property('subcategory');
        expect(res.body).to.have.property('isSubscription');
        expect(res.body.isSubscription).to.eql(false);
        expect(res.body).to.have.property('vendor');
        done();
      });
  });

  it('GET all transactions associated with userId', function(done) {
    chai.request(baseUrl)
      .get('/user/' + user._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('weeks');
        expect(res.body).to.have.property('months');
        expect(res.body.weeks[0]).to.have.property('categories');
        expect(res.body.weeks[0]).to.have.property('categoryNames');
        expect(res.body.weeks[0].categories[0]).to.have.property('name');
        expect(res.body.weeks[0].categories[0]).to.have.property('subcategories');
        expect(res.body.weeks[0].categories[0]).to.have.property('subcategoryNames');
        expect(res.body.weeks[0].categories[0].subcategories[0]).to.have.property('name');
        expect(res.body.weeks[0].categories[0].subcategories[0]).to.have.property('transactions');
        expect(res.body.weeks[0].categories[0].subcategories[0].transactions[0]).to.have.property('amount');
        expect(res.body.weeks[0].categories[0].subcategories[0].transactions[0]).to.have.property('vendor');
        expect(res.body.weeks[0].categories[0].subcategories[0].transactions[0]).to.have.property('date');
        expect(res.body.weeks[0].categories[0].subcategories[0].transactions[0]).to.have.property('category');
        expect(res.body.weeks[0].categories[0].subcategories[0].transactions[0]).to.have.property('subcategory');
        expect(res.body.weeks[0].categories[0].subcategories[0].transactions[0]).to.have.property('userId');
        expect(res.body.weeks[0].categories[0].subcategories[0].transactions[0]).to.have.property('isSubscription');
        expect(res.body.months[0].categories[0].subcategories[0].transactions[0].amount).to.eql(10);
        expect(res.body.months[0]).to.have.property('categories');
        expect(res.body.months[0]).to.have.property('categoryNames');
        expect(res.body.months[0].categories[0]).to.have.property('name');
        expect(res.body.months[0].categories[0]).to.have.property('subcategories');
        expect(res.body.months[0].categories[0]).to.have.property('subcategoryNames');
        expect(res.body.months[0].categories[0].subcategories[0]).to.have.property('name');
        expect(res.body.months[0].categories[0].subcategories[0]).to.have.property('transactions');
        expect(res.body.months[0].categories[0].subcategories[0].transactions[0]).to.have.property('amount');
        expect(res.body.months[0].categories[0].subcategories[0].transactions[0]).to.have.property('vendor');
        expect(res.body.months[0].categories[0].subcategories[0].transactions[0]).to.have.property('date');
        expect(res.body.months[0].categories[0].subcategories[0].transactions[0]).to.have.property('category');
        expect(res.body.months[0].categories[0].subcategories[0].transactions[0]).to.have.property('subcategory');
        expect(res.body.months[0].categories[0].subcategories[0].transactions[0]).to.have.property('userId');
        expect(res.body.months[0].categories[0].subcategories[0].transactions[0]).to.have.property('isSubscription');
        expect(res.body.months[0].categories[0].subcategories[0].transactions[0].amount).to.eql(10);
        done();
      });
  });

  it('GET bad :userId', function(done) {
    chai.request(baseUrl)
      .get('/user/badid')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(400);
        done();
      });
  });
});
