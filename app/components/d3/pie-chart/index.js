'use strict';

module.exports = (app) => {
  app.component('kbPieChart', {
    controller: 'ChartController',
    template: require('./pie-chart-template.html')
  });
};
