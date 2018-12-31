'use strict';

module.exports = function(app) {
  app.factory('auth', ['$window', 'jwtHelper', '$location', function($window, jwt, $location) {
    return {
      currentUser: {},
      getToken: function(options) {
        options = options || {};
        if(this.token) return this.token;
        if($window.localStorage.token) return this.setToken($window.localStorage);
      },
      setToken: function(tokenData) {
        $window.localStorage.token = tokenData.token;
        $window.localStorage.userId = tokenData.userId;
        this.token = tokenData.token;
        this.currentUser.userId = tokenData.userId;
        this.getUser();
        return tokenData.token;
      },
      getUser: function() {
        let token = this.getToken();
        if(!token) {
          return this.currentUser;
        }
        let decoded = jwt.decodeToken(token);
        this.currentUser.username = decoded.idd;
        $window.localStorage.username = decoded.idd;
        return this.currentUser;
      },
      refreshUser: function() {
        if(this.currentUser.username === undefined) {
          this.currentUser.username = $window.localStorage.username;
        }
        if(this.currentUser.userId === undefined) {
          this.currentUser.userId = $window.localStorage.userId;
        }
      },
      logOut: function() {
        $window.localStorage.token = '';
        $window.localStorage.username = '';
        $window.localStorage.userId = '';
        this.currentUser.userId = '';
        this.currentUser.username = '';
        this.token = '';
      }
    }
  }])
}
