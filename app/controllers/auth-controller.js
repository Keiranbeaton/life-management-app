'use strict';

module.exports = function(app) {

  app.controller('AuthController', ['$http', '$location', '$window', '$log', '$scope', 'auth', function($http, $location, $window, $log, $scope, auth) {
    this.currentUser = {};

    this.signup = function(user) {
      $log.log('AuthController.signup()');
      $http.post(this.baseUrl + '/signup', user)
        .then((res) => {
          auth.setToken(res.data);
          this.currentUser = auth.currentUser;
          $location.path('/home');
        }, (err) => {
          $log.error('Error in AuthController.signup: ', err);
        });
    };
    this.login = function(user) {
      $log.log('AuthController.login()');
      $http.get(this.baseUrl + '/signin')
        .then((res) => {
          auth.setToken(res.data);
          this.currentUser = auth.currentUser;
          $location.path('/home');
        }, (err) => {
          $log.error('Error in AuthController.login: ', err);
        });
    };
    this.logout = function() {
      $log.log('AuthController.logout()');
      auth.logOut();
      this.currentUser = auth.currentUser;
      $location.path('/login');
    }

    this.checkUser = function() {
      $log.log('AuthController.checkUser()');
      let user = this.getUser();
      if(user.username !== 'none') {
        $location.path('logout');
      }
    }
    this.checkNoUser = function() {
      $log.log('AuthController.checkNoUser()');
      let user = this.getUser();
      if(user.username === 'none') {
        $location.path('/login');
      }
    }
    this.getUser = auth.getUser.bind(auth);
  }]);
};
