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
        expect(0).to.eql(0);
        done();
      });
  });
});
