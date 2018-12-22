'use strict'

module.exports = (app) => {
  app.component('kbHome', {
    controller: 'HomeController',
    template: require('./home-template.html'),
    bindings: {
      baseUrl: '<',
      config: '<'
    }
  });
};
