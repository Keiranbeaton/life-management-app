'use strict';

module.exports = function(app) {
  app.factory('transaction', [function() {
    return {
      currentDate: new Date()
    }
  }]);
};
