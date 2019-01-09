'use strict';

require('!!file-loader?name=[name].[ext]!./html/index.html');
require('./scss/base.scss');

const angular = require('angular');
const angularRoute = require('angularRoute');
const angularMoment = require('angular-moment');
const lifeApp = angular.module('lifeApp', [angularRoute, angularMoment]);
lifeApp.constant('moment', require('moment-timezone'));

lifeApp.run(['$rootScope', ($rs) => {
  $rs.baseUrl = `${__API_URL__}/api`;
  $rs.httpConfig = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
}]);

require('./controllers')(lifeApp);
require('./components')(lifeApp);
require('./services')(lifeApp);

lifeApp.config(['$routeProvider', '$locationProvider', ($rp, $lp) => {
  $lp.hashPrefix('');
  $rp
    .when('/home', {
      template: require('./html/home.html')
    })
    .otherwise({
      redirectTo: '/home'
    });
}]);
