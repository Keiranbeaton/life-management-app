'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const Subcategory = require('../models/subcategory');
const Category = require('../models/category');
const User = require('../models/user');
const baseUrl = 'localhost:5000/api/subcategory';
chai.use(chaiHttp);

describe('Subcategory Tests', function() {
  let user;
  let category;
  let subcategory;
  before(function(done) {
    this.timeout(10000);
    user = new User({name: {first: 'SubcategoryFirst', last: 'SubcategoryLast'}, basic: {email: 'SubcategoryEmail@test.com', password: 'SubcategoryPassword'}});
    user.save().then((userData) => {
      this.user = userData;
      category = new Category({name: 'Subcategory Test', userId: user._id});
      category.save().then((categoryData) => {
        this.category = categoryData;
        subcategory = new Subcategory({name: 'Subcategory Test', userId: user._id, supercategory: category._id});
        subcategory.save().then((subcategoryData) => {
          this.subcategory = subcategoryData;
          done();
        }, (err) => {throw err;});
      }, (err) => {throw err;});
    }, (err) => {throw err;});
  });

  it('POST new subcategory', function(done) {
    chai.request(baseUrl)
      .post('/')
      .send({name: 'Test Subcategory', userId: user._id, supercategory: category._id})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('name');
        expect(res.body.name).to.eql('Test Subcategory');
        expect(res.body).to.have.property('userId');
        done();
      });
  });

  it('GET all subcategories associated with userId', function(done) {
    chai.request(baseUrl)
      .get('/user/' + user._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body[0]).to.have.property('_id');
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0].name).to.eql('Subcategory Test');
        expect(res.body[0]).to.have.property('userId');
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
});
