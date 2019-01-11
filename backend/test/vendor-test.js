'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const Vendor = require('../models/vendor');
const User = require('../models/user');
const baseUrl = 'localhost:5000/api/vendor';
chai.use(chaiHttp);

describe('Vendor Tests', function() {
  let user;
  let vendor;
  before(function(done) {
    user = new User({name: {first: 'VendorFirst', last: 'VendorLast'}, basic: {email: 'VendorEmail@test.com', password: 'VendorPassword'}});
    user.save().then((userData) => {
      this.user = userData;
      vendor = new Vendor({name: 'Vendor Test', userId: user._id});
      vendor.save().then((vendorData) => {
        this.vendor = vendorData;
        done();
      }, (err) => {throw err;});
    }, (err) => {throw err;});
  });

  it('POST new vendor', function(done) {
    chai.request(baseUrl)
      .post('/')
      .send({name: 'Test Vendor', userId: user._id})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('name');
        expect(res.body.name).to.eql('Test Vendor');
        expect(res.body).to.have.property('userId');
        expect(res.body.userId).to.eql(user._id);
        done();
      });
  });

  it('GET all vendors associated with userId', function(done) {
    chai.request(baseUrl)
      .get('/user/' + user._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        console.log('res.body', res.body);
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('name');
        expect(res.body.name).to.eql('Test Vendor');
        expect(res.body).to.have.property('userId');
        expect(res.body.userId).to.eql(user._id);
        done();
      });
  });

  it ('GET bad :userId', function(done) {
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
      .delete('/' + vendor._id)
      .end((err, res) => {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        done();
      });
  });
});
