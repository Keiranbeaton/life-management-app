'use strict';

const debug = require('debug')('Error');

module.exports = exports = function(statusCode, callback, message) {
  return function(error) {
    message = message || error.message;
    debug(error);
    return callback(error, message, statusCode);
  };
};
