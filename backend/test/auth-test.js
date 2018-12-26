'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;
const baseUrl = 'localhost:5000/api';
const User = require('../models/user');

describe('Auth Testing', function() {
  it('POST new user', function(done) {
    chai.request(baseUrl)
      .post('/signup')
      .send({basic: { email: 'AuthTest1@email.com', password: 'AuthTestPassword'}, name: {first: 'TestFirst', last: 'TestLast'}})
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res.body).to.have.property('token');
        expect(res.body.token.length).to.not.equal(0);
        console.log('res.body', res.body);
        done();
      });
  });
});
