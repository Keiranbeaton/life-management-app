'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const Category = require('../models/category');
const User = require('../models/user');
const baseUrl = 'localhost:5000/api/vendor';
chai.use(chaiHttp);

describe('Category Tests', function() {
  let user;
  let category;
  before(function(done) {
    user = new User({name: {first: 'CategoryFirst', last: 'CategoryLast'}, basic: {email: 'CategoryEmail@test.com', password: 'CategoryPassword'}});
    user.save().then((userData) => {
      this.user = userData;
      category = new Category({name: 'Category Test', userId: user._id});
      category.save().then((categoryData) => {
        this.category = categoryData;
        done();
      }, (err) => {throw err;});
    }, (err) => {throw err;});
  });

  it('POST new category', function(done) {
    chai.request(baseUrl)
      .post('/')
      .send({name: 'Test Category', userId: user._id})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        console.log('res.body', res.body);
        expect(res.body).to.have.property('name');
        expect(res.body.name).to.eql('Test Category');
        expect(res.body).to.have.property('userId');
        expect(res.body.userId).to.eql(user._id);
        done();
      });
  });

  it('GET all categories associated with userId', function(done) {
    chai.request(baseUrl)
      .get('/user/' + user._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        console.log('res.body', res.body);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('name');
        expect(res.body.name).to.eql('Test Category');
        expect(res.body).to.have.property('userId');
        expect(res.body.userId).to.eql(user._id);
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
      .delete('/' + category._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        done();
      });
  });
});
