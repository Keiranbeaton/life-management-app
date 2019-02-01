'use strict';

module.exports = function(app) {
  app.controller('SpendingController', ['$http', '$log', '$scope', '$location', 'auth', 'moment', 'd3', function($http, $log, $scope, $location, auth, moment, d3) {
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

    this.formatTransaction = function(dateInt, transObj, returnObj) {
      $log.debug('SpendingController.formatTransaction()');
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
        returnObj[dateInt].categories.push({name: transObj.category.name, subcategories: [], subcategoryNames: []});
        returnObj[dateInt].categories[returnObj[dateInt].categories.length - 1].subcategoryNames.push(transObj.subcategory.name);
        returnObj[dateInt].categories[returnObj[dateInt].categories.length - 1].subcategories.push({name: transObj.subcategory.name, transactions: []});
        returnObj[dateInt].categories[returnObj[dateInt].categories.length - 1].subcategories[0].transactions.push(transObj);
      }
    }

    this.placeTransaction = function(trans) {
      $log.debug('SpendingController.placeTransaction()');
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
            this.placeTransaction(res.data);
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
