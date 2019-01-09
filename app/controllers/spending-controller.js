'use strict';

module.exports = function(app) {
  app.controller('SpendingController', ['$http', '$log', '$scope', 'auth', 'moment', function($http, $log, $scope, auth, moment) {
    this.currentUser = auth.currentUser;
    this.transactions = {};

    this.getTransactions = function() {
      $log.debug('SpendingController.getTransactions()');
      $http.get(this.baseUrl + '/transactions/' + this.currentUser.userId, this.config)
        .then((res) => {
          this.transactions = res.data;
        }, (err) => {
          $log.error('SpendingController.getTransactions()', err);
        })
    }

    this.formatTransaction = function(dateInt, transObj, returnObj) {
      if(returnObj[dateInt].categoryNames.includes(transObj.category.name)) {
        let catIndex = returnObj[dateInt].categories.map(function(ele) {return ele.name;}).indexOf(transObj.category.name);
        if (returnObj[dateInt].categories[catIndex].subcategoryNames.includes(transObj.subcategory.name)) {
          let subIndex = returnObj[dateInt].categories[catIndex].subcategories.map(function(ele) {return ele.name}).indexOf(transObj.subcategory.name);
          returnObj[dateInt].categories[catIndex].subcategories[subIndex].push(transObj);
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

      if(transMoment.isBetween(now, startOfWeek)) {
        this.formatTransaction(0, trans, this.transactions.weeks);
      } else if (transMoment.isBetween(startOfWeek, startOfWeek.subtract(7, 'd'))) {
        this.formatTransaction(1, trans, this.transactions.weeks);
      } else if (transMoment.isBetween(startOfWeek.subtract(7, 'd'), startOfWeek.subtract(14, 'd'))) {
        this.formatTransaction(2, trans, this.transactions.weeks);
      } else if (transMoment.isBetween(startOfWeek.subtract(14, 'd'), startOfWeek.subtract(21, 'd'))) {
        this.formatTransaction(3, trans, this.transactions.weeks);
      } else if (transMoment.isBetween(startOfWeek.subtract(21, 'd'), startOfWeek.subtract(28, 'd'))) {
        this.formatTransaction(4, trans, this.transactions.weeks);
      } else if (transMoment.isBetween(startOfWeek.subtract(28, 'd'), startOfWeek.subtract(35, 'd'))) {
        this.formatTransaction(5, trans, this.transactions.weeks);
      } else if (transMoment.isBetween(startOfWeek.subtract(35, 'd'), startOfWeek.subtract(42, 'd'))) {
        this.formatTransaction(6, trans, this.transactions.weeks);
      } else if (transMoment.isBetween(startOfWeek.subtract(42, 'd'), startOfWeek.subtract(49, 'd'))) {
        this.formatTransaction(7, trans, this.transactions.weeks);
      } else if (transMoment.isBetween(startOfWeek.subtract(49, 'd'), startOfWeek.subtract(56, 'd'))) {
        this.formatTransaction(8, trans, this.transactions.weeks);
      } else if (transMoment.isBetween(startOfWeek.subtract(56, 'd'), startOfWeek.subtract(63, 'd'))) {
        this.formatTransaction(9, trans, this.transactions.weeks);
      } else if (transMoment.isBetween(startOfWeek.subtract(63, 'd'), startOfWeek.subtract(70, 'd'))) {
        this.formatTransaction(10, trans, this.transactions.weeks);
      } else if (transMoment.isBetween(startOfWeek.subtract(70, 'd'), startOfWeek.subtract(77, 'd'))) {
        this.formatTransaction(11, trans, this.transactions.weeks);
      } else {
        $log.log('Transaction beyond last twelve weeks');
      }

      if (transMoment.month() === now.month() && transMoment.year() === now.year()) {
        this.formatTransaction(0, trans, this.transactions.months);
      } else if (transMoment.month() === now.subtract(1, 'M' && transMoment.year() === now.subtract(1, 'M').year())) {
        this.formatTransaction(1, trans, this.transactions.months);
      } else if (transMoment.month() === now.subtract(2, 'M' && transMoment.year() === now.subtract(2, 'M').year())) {
        this.formatTransaction(2, trans, this.transactions.months);
      }else if (transMoment.month() === now.subtract(3, 'M' && transMoment.year() === now.subtract(3, 'M').year())) {
        this.formatTransaction(3, trans, this.transactions.months);
      }else if (transMoment.month() === now.subtract(4, 'M' && transMoment.year() === now.subtract(4, 'M').year())) {
        this.formatTransaction(4, trans, this.transactions.months);
      }else if (transMoment.month() === now.subtract(5, 'M' && transMoment.year() === now.subtract(5, 'M').year())) {
        this.formatTransaction(5, trans, this.transactions.months);
      }else if (transMoment.month() === now.subtract(6, 'M' && transMoment.year() === now.subtract(6, 'M').year())) {
        this.formatTransaction(6, trans, this.transactions.months);
      }else if (transMoment.month() === now.subtract(7, 'M' && transMoment.year() === now.subtract(7, 'M').year())) {
        this.formatTransaction(7, trans, this.transactions.months);
      }else if (transMoment.month() === now.subtract(8, 'M' && transMoment.year() === now.subtract(8, 'M').year())) {
        this.formatTransaction(8, trans, this.transactions.months);
      }else if (transMoment.month() === now.subtract(9, 'M' && transMoment.year() === now.subtract(9, 'M').year())) {
        this.formatTransaction(9, trans, this.transactions.months);
      }else if (transMoment.month() === now.subtract(10, 'M' && transMoment.year() === now.subtract(10, 'M').year())) {
        this.formatTransaction(10, trans, this.transactions.months);
      }else if (transMoment.month() === now.subtract(11, 'M' && transMoment.year() === now.subtract(11, 'M').year())) {
        this.formatTransaction(11, trans, this.transactions.months);
      }else if (transMoment.month() === now.subtract(12, 'M' && transMoment.year() === now.subtract(12, 'M').year())) {
        this.formatTransaction(12, trans, this.transactions.months);
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
        })
      }
    }

    this.removeTransaction = function(trans) {
      $log.debug('SpendingController.removeTransaction()');
      $http.delete(this.baseUrl + '/transaction' + trans._id, this.config)
        .then((res) => {
          $log.log('Successfully Deleted Transaction', res.data);
          // remove transaction from frontend here
        })
        .catch((err) => {
          $log.error('Error in SpendingController.removeTransaction()', err);
        });
    };

    this.addVendor = function() {
      $log.debug('SpendingController.addVendor()');
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

  }]);
}
