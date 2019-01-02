'use strict';

module.exports = function(app) {
  app.controller('HomeController', ['$http', '$log', '$scope', 'auth', function($http, $log, $scope, auth) {
    this.currentUser = auth.currentUser;
    this.getUserInfo = function() {
      $log.debug('HomeController.getUserInfo()');
      $http.get(this.baseUrl + '/user/' + this.currentUser.userId, this.config)
        .then((res) => {
          this.user = res.data;
        })
    }
  }]);
};
