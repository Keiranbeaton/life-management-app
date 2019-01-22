'use strict';

module.exports = function(app) {

  app.controller('AuthController', ['$http', '$location', '$window', '$log', '$scope', 'auth', 'transaction', function($http, $location, $window, $log, $scope, auth, transaction) {
    this.currentUser = {};

    this.signup = function(user) {
      $log.debug('AuthController.signup()');
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
      $log.debug('AuthController.login()');
      $http.get(this.baseUrl + '/login', {headers: {'Authorization': 'Basic ' + $window.btoa(user.email + ':' + user.password)}})
        .then((res) => {
          auth.setToken(res.data);
          this.currentUser = auth.currentUser;
          $location.path('/home');
        }, (err) => {
          $log.error('Error in AuthController.login: ', err);
        });
    };

    this.logout = function() {
      $log.debug('AuthController.logout()');
      auth.logOut();
      this.currentUser = auth.currentUser;
      $log.log('this.currentUser', this.currentUser);
      $location.path('/login');
    }

    this.checkUser = function() {
      $log.debug('AuthController.checkUser()');
      let user = this.getUser();
      $log.log('user', user);
      if(user.username !== '' && user.username !== undefined) {
        $location.path('/logout');
      }
    }
    this.checkNoUser = function() {
      $log.debug('AuthController.checkNoUser()');
      let user = this.getUser();
      $log.log('user', user);
      if(user.username === '' || user.username === undefined) {
        $location.path('/login');
      }
    }
    this.getUser = auth.getUser.bind(auth);
  }]);
};
