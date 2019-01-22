'use strict';

module.exports = exports = function(req, res, next) {
  try {
    let header = req.headers.authorization;
    console.log('header', header);
    let basicString = header.split(' ')[1];
    let authBuffer = Buffer.from(basicString, 'base64');
    let authString = authBuffer.toString();
    let authArr = authString.split(':');
    req.auth = {email: authArr[0], password: authArr[1]};
    authBuffer.fill(0);
    next();
  } catch(err) {
    err.statusCode = 400;
    err.message = 'Invalid BasicHTTP Authentication';
    next(err);
  }
};
