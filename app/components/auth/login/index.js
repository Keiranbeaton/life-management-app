'use strict'

module.exports = (app) => {
  app.component('kbLogin', {
    controller: 'AuthController',
    template: require('./login-template.html'),
    bindings: {
      baseUrl: '<',
      config: '<'
    }
  });
};
