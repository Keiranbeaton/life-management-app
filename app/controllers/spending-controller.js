'use strict';

module.exports = function(app) {
  app.controller('SpendingController', ['$http', '$log', '$scope', '$location', 'auth', 'moment', function($http, $log, $scope, $location, auth, moment) {
    this.currentUser = auth.currentUser;
    this.transactions = {};
    this.formValues = {vendor: {}, category: {}, subcategory: {}, transaction: {}};
    this.showHide = {addButtons: 0, leftContainer: 1};

    this.setButtons = function(num) {
      if (this.showHide.addButtons === num) {
        this.showHide.addButtons = 0;
      } else {
        this.showHide.addButtons = num;
      }
    }

    this.setLeft = function(num) {
      this.showHide.leftContainer = num;
    }

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

    this.formatTransaction = function(dateInt, transObj, returnObj) {
      if(returnObj[dateInt].categoryNames.includes(transObj.category.name)) {
        let catIndex = returnObj[dateInt].categories.map(function(ele) {return ele.name;}).indexOf(transObj.category.name);
        if (returnObj[dateInt].categories[catIndex].subcategoryNames.includes(transObj.subcategory.name)) {
          let subIndex = returnObj[dateInt].categories[catIndex].subcategories.map(function(ele) {return ele.name}).indexOf(transObj.subcategory.name);
          returnObj[dateInt].categories[catIndex].subcategories[subIndex].transactions.push(transObj);
        } else {
          returnObj[dateInt].categories[catIndex].subcategoryNames.push(transObj.subcategory.name);
          returnObj[dateInt].categories[catIndex].subcategories.push({name: transObj.subcategory.name, transactions: []});
          returnObj[dateInt].categories[catIndex].subcategories[returnObj[dateInt].categories[catIndex].subcategories.length - 1].transactions.push(transObj);
        }
      } else {
        returnObj[dateInt].categoryNames.push(transObj.category.name);
        returnObj[dateInt].categories.push({name: transObj.category.name, subcategories: []});
        returnObj[dateInt].categories[returnObj[dateInt].categories.length - 1].subcategoryNames.push(transObj.subcategory.name);
        returnObj[dateInt].categories[returnObj[dateInt].categories.length - 1].subcategories.push({name: transObj.subcategory.name, transactions: []});
        returnObj[dateInt].categories[returnObj[dateInt].categories.length - 1].subcategories[0].transactions.push(transObj);
      }
    }

    this.placeTransaction = function(trans) {
      $log.debug('SpendingController.sortTransaction()');
      let now = moment();
      let startOfWeek = moment().startOf('week');
      let transMoment = moment(trans.date);
      for (let i = 0; i < 12; i++) {
        if(transMoment.isAfter(startOfWeek.subtract((7 * i), 'd')) || transMoment.isSame(startOfWeek.subtract((7 * i), 'd'))) {
          this.formatTransaction(i, trans, this.transactions.weeks);
          break;
        }
      }
      for(let i = 0; i < 12; i++) {
        if (transMoment.month() === now.subtract(i, 'M').month() && transMoment.year() === now.subtract(i, 'M').year()) {
          this.formatTransaction(i, trans, this.transactions.months);
          break;
        }
      }
    }

    this.addTransaction = function(trans) {
      $log.debug('SpendingController.addTransaction()');
      trans.userId = this.currentUser._id;
      if (trans.date == null || trans.amount == null || trans.category == null || trans.subcategory == null || trans.isSubscription == null) {
        $log.error('transaction object incomplete');
      } else {
        $http.post(this.baseUrl + '/transaction', trans, this.config)
        .then((res) => {
          $log.log("Successfully added transaction", res.data);
          this.placeTransaction(res.data);
        })
        .catch((err) => {
          $log.error('Error in SpendingController.addTransaction()', err);
          // add error response
        })
      }
    }

    this.deleteTransaction = function(trans) {
      $log.debug('SpendingController.deleteTransaction()');
      $http.delete(this.baseUrl + '/transaction' + trans._id, this.config)
        .then((res) => {
          $log.log('Successfully Deleted Transaction', res.data);
          for(let i = 0; i < this.transactions.weeks.length - 1; i++) {
            for(let j = 0; j < this.transactions.weeks[i].categories.length - 1; j++) {
              for(let k = 0; k < this.transactions.weeks[i].categories[j].subcategories.length - 1; k++) {
                for(let m = 0; m < this.transactions.weeks[i].categories[j].subcategories[k].transactions.length - 1; m++) {
                  if(this.transactions.weeks[i].categories[j].subcategories[k].transactions[m]._id === res.data._id) {
                    this.transactions.weeks[i].categories[j].subcategories[k].transactions.splice(m, 1);
                    m = this.transactions.weeks[i].categories[j].subcategories[k].transactions.length;
                    k = this.transactions.weeks[i].categories[j].sucategories.length;
                    j = this.transactions.weeks[i].categories.length;
                    i = this.transactions.weeks.length;
                  }
                }
              }
            }
          }

          for(let i = 0; i < this.transactions.months.length - 1; i++) {
            for(let j = 0; j < this.transactions.months[i].categories.length - 1; j++) {
              for(let k = 0; k < this.transactions.months[i].categories[j].subcategories.length - 1; k++) {
                for (let m = 0; m < this.transactions.months[i].categories[j].subcategories[k].transactions.length - 1; m++) {
                  if(this.transactions.months[i].categories[j].subcategories[k].transactions[m]._id === res.data._id) {
                    this.transactions.months[i].categories[j].subcategories[k].transactions.splice(m, 1);
                    m = this.transactions.months[i].categories[j].subcategories[k].transactions.length;
                    k = this.transactions.months[i].categories[j].subcategories.length;
                    k = this.transactions.months[i].categories.length;
                    i = this.transactions.months.length;
                  }
                }
              }
            }
          }
        })
        .catch((err) => {
          $log.error('Error in SpendingController.removeTransaction()', err);
          // Add error response
        });
    }

    this.checkNoUser = function() {
      $log.debug('SpendingController.checkNoUser()');
      let user = this.getUser();
      if(user.username === '' || user.username === undefined) {
        $location.path('/login');
      }
    }

    this.getUser = auth.getUser.bind(auth);

    this.addVendor = function(vendor) {
      $log.debug('SpendingController.addVendor()');
      vendor.userId = this.currentUser._id;
      if(vendor.name == null || vendor.useerId == null) {
        $log.error('Vendor must have a name');
      } else {
        $http.post(this.baseUrl + '/vendor', vendor,  this.config)
          .then((res) => {
            $log.log('Successfully Added Vendor', res.data);
            this.user.vendors.push(res.data);
          })
          .catch((err) => {
            $log.error('Error in SpendingController.addVendor()', err);
            // add error response
          })
      }
    }

    this.removeVendor = function() {
      $log.debug('SpendingController.removeVendor()');
    }

    this.addCategory = function() {
      $log.debug('SpendingController.addCategory()');
    }

    this.removeCategory = function() {
      $log.debug('SpendingController.removeCategory()');
    }

    this.addSubcategory = function() {
      $log.debug('SpendingController.addSubcategory()');
    }

    this.removeSubcategory = function() {
      $log.debug('SpendingController.removeSubcategory()');
    }

    this.initSpending = function() {
      this.checkNoUser();
      this.getUserData();
    }

  }]);
}
