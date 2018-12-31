'use strict';

module.exports = (app) => {
  app.component('kbLogout', {
    controller: 'AuthController',
    template: require('./logout-template.html'),
    bindings: {
      baseUrl: '<',
      config: '<'
    }
  });
};
