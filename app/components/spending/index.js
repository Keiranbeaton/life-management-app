'use strict';

module.exports = (app) => {
  app.component('kbSpending', {
    controller: 'SpendingController',
    template: require('./spending-template.html'),
    bindings: {
      baseUrl: '<',
      config: '<'
    }
  });
};
