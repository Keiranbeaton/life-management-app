'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const baseUrl = 'localhost:5000/api';
const User = require('../models/user');

describe('Auth Testing', function() {
  it('POST new user', function(done) {
    this.timeout(4000);
    chai.request(baseUrl)
      .post('/signup')
      .send({firstName: 'testFirst', lastName: 'testLast', email: 'testEmail@test.com', password: 'testPassword'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        expect(res.body.token.length).to.not.eql(0);
        done();
      });
  });
});

describe('Auth testing with User in Database', function() {
  before(function(done) {
    let user = new User({name: {first: 'TestFirst', last: 'TestLast'}, basic: {email:'newTestEmail@test.com', password:'AuthTest'}});
    user.generateHash(user.basic.password).then((token) => {
      this.tokenData = token;
      user.save().then((userData) => {
        this.user = userData;
        done();
      }, (err) => {
        throw err;
      });
    }, (err) => {
      throw err;
    })
  });
  it('Authenticating Existing User', function(done) {
    chai.request(baseUrl)
      .get('/login')
      .auth('newTestEmail@test.com', 'AuthTest')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.body).to.have.property('token');
        expect(res.body.token.length).to.not.eql(0);
        done();
      });
  });
  it('Authenticating Bad Credentials', function(done) {
    chai.request(baseUrl)
      .get('/login')
      .auth('bad', 'credentials')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(404);
        expect(res.text).to.eql('"User not found"');
        done();
      });
  });
});
