'use strict';

const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');
moment().format();
const Transaction = require('../models/transaction');
const User = require('../models/user');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Vendor = require('../models/vendor');
const transactionFormatter = require('../lib/transaction-format');

describe('Transaction Formatter Tests', function() {
  let user;
  let vendor;
  let category;
  let subcategory;
  let subcategory2;
  let transaction;
  let transaction2;
  let transaction3;
  let transaction4;
  let transactionArray;
  let testObj;
  before(function(done) {
    user = new User({name: {first: 'FormatFirst', last: 'FormatLast'}, basic: {email: 'FormatEmail@test.com', password: 'FormatPassword'}});
    user.save().then((userData) => {
      this.user = userData;
      vendor = new Vendor({name: 'FormatVendor', userId: user._id});
      vendor.save().then((vendorData) => {
        this.vendor = vendorData;
        category = new Category({name: 'FormatCategory1', userId: user._id});
        category.save().then((categoryData) => {
          this.category = categoryData;
          subcategory = new Subcategory({name: 'FormatSubcategory1', userId: user._id, supercategory: category._id});
          subcategory.save().then((subcategoryData) => {
            this.subcategory = subcategoryData;
            transaction = new Transaction({userId: user._id, date: moment(), amount: 10, vendor: vendor._id, category: category._id, subcategory: subcategory._id, isSubscription: false});
            transaction.save().then((transactionData) => {
              this.transaction = transactionData;
              transaction2 = new Transaction({userId: user._id, date: moment(), amount: 20, vendor: vendor._id, category: category._id, subcategory: subcategory._id, isSubscription: false});
              transaction2.save().then((transaction2Data) => {
                this.transaction2 = transaction2Data;
                subcategory2 = new Subcategory({name: 'FormatSubcategory2', userId: user._id, supercategory: category._id});
                subcategory2.save().then((subcategory2Data) => {
                  this.subcategory2 = subcategory2Data;
                  transaction3 = new Transaction({userId: user._id, date: moment(), amount: 30, vendor: vendor._id, category: category._id, subcategory: subcategory2._id});
                  transaction3.save().then((transaction3Data) => {
                    this.transaction3 = transaction3Data;
                    transaction4 = new Transaction({userId: user._id, date: moment().subtract(1, 'M'), amount: 40, vendor: vendor._id, category: category._id, subcategory: subcategory._id});
                    transaction4.save().then((transaction4Data) => {
                      this.transaction4 = transaction4Data;
                      Transaction.find({userId: user._id}).populate('vendor category subcategory').then((returnArray) => {
                        this.transactionArray = returnArray;
                        transactionArray = returnArray;
                        testObj = transactionFormatter.format(transactionArray);
                        done();
                      }, (err) => {throw err;});
                    }, (err) => {throw err;});
                  }, (err) => {throw err;});
                }, (err) => {throw err;});
              }, (err) => {throw err;});
            }, (err) => {throw err;});
          }, (err) => {throw err;});
        }, (err) => {throw err;});
      }, (err) => {throw err;});
    }, (err) => {throw err;});
  });

  it('Sort transactions', function(done) {
    expect(testObj.weeks[0].allTransactions.length).to.eql(2);
    expect(testObj.months[1].allTransactions.length).to.eql(1);
    done();
  });
});
