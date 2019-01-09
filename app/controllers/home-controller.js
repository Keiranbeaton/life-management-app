'use strict';

module.exports = function(app) {
  app.controller('HomeController', ['$http', '$log', '$scope', '$location', 'auth', function($http, $log, $scope, $location, auth) {
    this.currentUser = auth.currentUser;
    this.getUserInfo = function() {
      $log.debug('HomeController.getUserInfo()');
      $http.get(this.baseUrl + '/user/' + this.currentUser.userId, this.config)
        .then((res) => {
          this.user = res.data;
        })
    }

    this.checkNoUser = function() {
      $log.debug('HomeController.checkNoUser()');
      let user = this.getUser();
      if(user.username === 'none') {
        $location.path('/login');
      }
    }
    this.getUser = auth.getUser.bind(auth);
  }]);
};
