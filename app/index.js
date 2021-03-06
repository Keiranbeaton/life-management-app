'use strict';

require('!!file-loader?name=[name].[ext]!./html/index.html');
require('./styles/base.scss');

const angular = require('angular');
const angularRoute = require('angular-route');
const angularJWT = require('angular-jwt');
const angularMoment = require('angular-moment');
const d3 = require('d3');
const lifeApp = angular.module('lifeApp', [angularRoute, angularMoment, angularJWT]);
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
    .when('/spending', {
      template: require('./html/spending.html')
    })
    .when('/signup', {
      template: require('./html/signup.html')
    })
    .when('/login', {
      template: require('./html/login.html')
    })
    .when('/logout', {
      template: require('./html/logout.html')
    })
    .otherwise({
      redirectTo: '/login'
    });
}]);
