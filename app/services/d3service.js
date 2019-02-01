'use strict';

module.exports = function(app) {
  app.factory('d3', [function() {
    var d3 = require('d3');
    return d3;
  }]);
}
