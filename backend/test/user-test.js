'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const User = require('../models/user');
const baseUrl = 'localhost:5000/api/user';
chai.use(chaiHttp);

describe('User Tests', function() {
  let user;
  before(function(done) {
    user = new User({name: {first: 'UserFirst', last: 'UserLast'}, basic: {email: 'UserEmail@test.com', password: 'UserPassword'}});
    user.save().then((userData) => {
      this.user = userData;
      done();
    }, (err) => {throw err;});
  });
  it('GET :id', function(done) {
    chai.request(baseUrl)
      .get('/' + user._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('name');
        expect(res.body.name).to.have.property('first');
        expect(res.body.name.first).to.eql('UserFirst');
        expect(res.body.name).to.have.property('last');
        expect(res.body.name.last).to.eql('UserLast');
        expect(res.body).to.have.property('basic');
        expect(res.body.basic).to.have.property('email');
        expect(res.body.basic.email).to.eql('UserEmail@test.com');
        expect(res.body.basic).to.have.property('password');
        expect(res.body.basic.password).to.eql('UserPassword');
        done();
      });
  });
  it('Get bad :id', function(done) {
    chai.request(baseUrl)
      .get('/badid')
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(404);
        done();
      });
  });
  it('Put :id', function(done) {
    chai.request(baseUrl)
      .put('/' + user._id)
      .send({name:{first: 'newFirst', last: 'newLast'}})
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.name.first).to.eql('newFirst');
        expect(res.body.name.last).to.eql('newLast');
        done();
      });
  });
  it('Put bad request', function(done) {
    chai.request(baseUrl)
      .put('/' + user._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(400);
        expect(res.text).to.eql('"No data sent with request"');
        done();
      });
  });
  it('Delete :id', function(done) {
    chai.request(baseUrl)
      .delete('/' + user._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        done();
      });
  });
});
