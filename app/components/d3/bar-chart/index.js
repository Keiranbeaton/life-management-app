'use strict';

module.exports = (app) => {
  app.component('kbBarChart', {
    controller: 'ChartController',
    template: require('./bar-chart-template.html')
  });
};
