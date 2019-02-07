'use strict';

module.exports = function(app) {
  app.controller('SpendingController', ['$http', '$log', '$scope', '$location', 'auth', 'moment', 'd3', function($http, $log, $scope, $location, auth, moment, d3) {
    this.currentUser = auth.currentUser;
    this.transactions = {};
    this.formValues = {vendor: {}, category: {}, subcategory: {}, transaction: {}};
    this.showHide = {addButtons: 0, leftContainer: 1, compareChart: 0};
    this.selectedTransactions = [];

    const weeklyChart = d3.select('#weekly');
    const monthlyChart = d3.select('#monthly');

    this.setButtons = function(num) {
      if (this.showHide.addButtons === num) {
        this.showHide.addButtons = 0;
      } else {
        this.showHide.addButtons = num;
      }
      this.formValues = {vendor: {}, category: {}, subcategory: {}, transaction: {}};
    }

    this.setLeft = function(num) {
      this.showHide.leftContainer = num;
      this.formValues = {vendor: {}, category: {}, subcategory: {}, transaction: {}};
    }

    this.checkNoUser = function() {
      $log.debug('SpendingController.checkNoUser()');
      let user = this.getUser();
      if(user.username === '' || user.username === undefined) {
        $location.path('/login');
      }
    }

    this.getUser = auth.getUser.bind(auth);

    this.getUserData = function() {
      $log.debug('SpendingController.getUserData()');
      $http.get(this.baseUrl + '/user/transactions/' + this.currentUser.userId, this.config)
        .then((res) => {
          this.transactions = res.data.transactions;
          this.user = res.data.user;
          $log.log('res.data', res.data);
        }, (err) => {
          $log.error('SpendingController.getTransactions()', err);
          // add error response
        });
    }

    this.sortWeek = function(trans) {
      $log.debug('SpendingController.sortWeek()');
      let now = moment();
      let startOfWeek = moment().startOf('week');
      let transMoment = moment(trans.date);

      for (let i = 0; i < 12; i++) {
        if(transMoment.isAfter(startOfWeek.subtract((7 * i), 'd')) || transMoment.isSame(startOfWeek.subtract((7 * i), 'd'))) {
          this.transactions.weeks[i].allTransactions.push(trans);
          this.transactions.weeks[i].chartCategories[trans.category.name] += trans.amount;
          this.transactiona.weeks[i].chartSubcategories[trans.subcategory.name] += trans.amount;
          break;
        }
      }
    }

    this.deleteFromWeek = function(trans) {
      $log.debug('SpendingController.deleteFromWeek()');
      let now = moment();
      let startOfWeek = moment().startOf('week');
      let transMoment = moment(trans.date);

      for (let i = 0; i < 12; i++) {
        if (transMoment.isAfter(startOfWeek.subtract((7 * i), 'd')) || transMoment.isSame(startOfWeek.subtract((7 * i), 'd'))) {
          this.transactions.weeks[i].allTransactions.splice(this.transactions.weeks[i].indexOf(trans), 1);
          this.transactions.weeks[i].chartCategories[trans.category.name] -= trans.amount;
          this.transactions.weeks[i].chartSubcategories[trans.subcategory.name] -= trans.amount;
          break;
        }
      }
    }

    this.sortMonth = function(trans) {
      $log.debug('SpendingController.sortMonth()');
      let now = moment();
      let transMoment = moment(trans.date);

      for(let i = 0; i < 13; i++) {
        if(transMoment.month() === now.subtract(i, 'M').month() && transMoment.year() === now.subtract(i, 'M').year()) {
          this.transactions.months[i].allTransactions.push(trans);
          this.transactions.months[i].chartCategories[trans.category.name] += trans.amount;
          this.transactions.months[i].chartSubcategories[trans.subcategory.name] += trans.amount;
          break;
        }
      }
    }

    this.deleteFromMonth = function(trans) {
      $log.debug('SpendingController.deleteFromMonth()');
      let now = moment();
      let transMoment = moment(trans.date);

      for(let i = 0; i < 12; i++) {
        if(transMoment.month() === now.subtract(i, 'M').month() && transMoment.year() === now.subtract(i, 'M').year()) {
          this.transactions.months[i].allTransactions.splice(this.transactions.months[i].allTransactions.indexOf(trans), 1);
          this.transactions.months[i].chartCategories[trans.category.name] -= trans.amount;
          this.transactions.months[i].chartSubcategories[trans.subcategory.name] -= trans.amount;
          break;
        }
      }
    }

    this.formatTransaction = function(trans) {
      $log.debug('SpendingController.formatTransaction()');
      this.sortMonth(trans);
      this.sortWeek(trans);
    }

    this.addTransaction = function(trans) {
      $log.debug('SpendingController.addTransaction()');
      let dateMoment = moment(trans.date);
      if (dateMoment.isAfter(moment(), 'day')) {
        $log.error('Date Cannot be in the future');
      } else {
        trans.userId = this.user._id;
        if (trans.date == null || trans.amount == null || trans.category == null || trans.subcategory == null) {
          $log.error('transaction object incomplete');
        } else {
          $http.post(this.baseUrl + '/transaction', trans, this.config)
          .then((res) => {
            $log.log("Successfully added transaction", res.data);
            this.formatTransaction(res.data);
            this.showHide.addButtons = 0;
            this.formValues.transaction = {date: undefined, amount: undefined, vendor: undefined, category: undefined, subcategory: undefined};
          })
          .catch((err) => {
            $log.error('Error in SpendingController.addTransaction()', err);
            // add error response
          })
        }
      }
    }

    this.deleteTransaction = function(trans) {
      $log.debug('SpendingController.deleteTransaction()');
      $http.delete(this.baseUrl + '/transaction' + trans._id, this.config)
        .then((res) => {
          $log.log('Successfully Deleted Transaction', res.data);
          this.deleteFromWeek(res.data);
          this.deleteFromMonth(res.data);
        })
        .catch((err) => {
          $log.error('Error in SpendingController.removeTransaction()', err);
          // Add error response
        });
    }

    this.addVendor = function(vendor) {
      $log.debug('SpendingController.addVendor()');
      vendor.userId = this.user._id;
      if(vendor.name == null || vendor.userId == null) {
        $log.error('Vendor must have a name and userId', vendor.name, vendor.userId);
      } else {
        $http.post(this.baseUrl + '/vendor', vendor,  this.config)
          .then((res) => {
            $log.log('Successfully Added Vendor', res.data);
            this.user.vendors.push(res.data);
            this.showHide.addButtons = 0;
            this.formValues.vendor.name = undefined;

          })
          .catch((err) => {
            $log.error('Error in SpendingController.addVendor()', err);
            // add error response
          });
      }
    }

    this.removeVendor = function(vendor) {
      $log.debug('SpendingController.removeVendor()');
      $http.delete(this.baseUrl + '/vendor/' + vendor._id, this.config)
        .then((res) => {
          $log.log('Successfully deleted Vendor', res.data);
          this.user.vendors.splice(this.user.vendors.indexOf(vendor), 1);
        }, (err) => {
          $log.error('Error if SpendingController.removeVendor()', err);
          // add error response;
        });
    }

    this.addCategory = function(category) {
      $log.debug('SpendingController.addCategory()');
      category.userId = this.user._id;
      if (category.name == null || category.userId == null) {
        $log.error('Category must have a name and userId', category.name, category.userId);
      } else {
        $http.post(this.baseUrl + '/category', category, this.config)
          .then((res) => {
            $log.log('Successfully Added Category', res.data);
            this.user.categories.push(res.data);
            this.showHide.addButtons = 0;
            this.formValues.category.name = undefined;
          })
          .catch((err) => {
            $log.error('Error in SpendingController.addCategory()');
            // add error response
          });
      }
    }

    this.removeCategory = function(category) {
      $log.debug('SpendingController.removeCategory()');
      $http.delete(this.baseUrl + '/category/' + category._id, this.config)
        .then((res) => {
          $log.log('Successfully Deleted Category', res.data);
          this.user.categories.splice(this.user.categories.indexOf(category), 1);
        }, (err) => {
          $log.error('Error in SpendingController.removeCategory()', err);
          // add error response
        });
    }

    this.addSubcategory = function(subcategory) {
      $log.debug('SpendingController.addSubcategory()');
      if (subcategory.name == null || subcategory.supercategory == null) {
        $log.error('Subcategory must have a name and a supercategory', subcategory.name, subcategory.supercategory);
      } else {
        $http.post(this.baseUrl + '/subcategory', subcategory, this.config)
          .then((res) => {
            $log.log('Successfully added Subcategory', res.data);
            let index = this.user.categories.map(function(category) {return category.name}).indexOf(subcategory.supercategory.name);
            if (Array.isArray(this.user.categories[index].subcategories)) {
              this.user.categories[index].subcategories.push(res.data);
            } else {
              this.user.categories[index].subcategories = [res.data];
            }
            this.showHide.addButtons = 0;
            this.formValues.subcategory = {name: undefined, supercategory: undefined};
          });
      }
    }

    this.removeSubcategory = function(subcategory) {
      $log.debug('SpendingController.removeSubcategory()');
      $http.delete(this.baseUrl + '/subcategory/' + subcategory._id, this.config)
        .then((res) => {
          $log.log('Successfully deleted Subcategory', res.data);
          let index = this.user.categories.map(function(category) {return category.name}).indexOf(subcategory.supercategory.name);
          this.user.categories[index].subcategories.splice(this.user.categories[index].subcategories.indexOx(subcategory), 1);
        }, (err) => {
          $log.error('Error in SpendingController.removeSubcategory()', err);
          // add error response
        });
    }

    this.initSpending = function() {
      this.checkNoUser();
      this.getUserData();
      $log.log('this', this);
    }

  }]);
}
