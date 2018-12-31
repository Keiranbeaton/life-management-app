'use strict';

module.exports = (app) => {
  app.component('kbSignup', {
    controller: 'AuthController',
    template: require('./signup-template.html'),
    bindings: {
      baseUrl: '<',
      config: '<'
    }
  });
};
