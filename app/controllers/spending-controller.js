'use strict';

module.exports = function(app) {
  app.controller('SpendingController', ['$http', '$log', '$scope', '$location', 'auth', 'moment', 'd3', function($http, $log, $scope, $location, auth, moment, d3) {
    this.currentUser = auth.currentUser;
    this.transactions = {};
    this.d3Variables = {};
    this.formValues = {vendor: {}, category: {}, subcategory: {}, transaction: {}};
    this.showHide = {addButtons: 0, leftContainer: 1};
    this.selectedTransactions = [];
    this.chartValues = {timeSelect: 0, dataSelect: 0};
    this.categoryLength = 0;
    this.subcategoryLength = 0;
    const margin = {top: 10, right: 10, bottom: 20, left: 40};
    let width = 320 - margin.left  - margin.right;
    let height = 560 - margin.top - margin.bottom;

    const svg = d3.select('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

    this.setMonths = function() {
      $log.debug('SpendingController.setMonths()');
      this.chartValues.timeSelect = 0;
      this.initChart(this.chartValues.timeSelect, this.chartValues.dataSelect);
    }

    this.setWeeks = function() {
      $log.debug('SpendingController.setWeeks()');
      this.chartValues.timeSelect = 1;
      this.initChart(this.chartValues.timeSelect, this.chartValues.dataSelect);
    }

    this.setCategories = function() {
      $log.debug('SpendingController.setCategories()');
      this.chartValues.dataSelect = 0;
      this.initChart(this.chartValues.timeSelect, this.chartValues.dataSelect);
    }

    this.setSubcategories = function() {
      $log.debug('SpendingController.setSubcategories()');
      this.chartValues.dataSelect = 1;
      this.initChart(this.chartValues.timeSelect, this.chartValues.dataSelect);
    }

    this.initChart = function(timeSelect = 0, dataSelect = 0) {
      $log.debug('SpendingController.initChart()')
      let timeNames = (timeSelect === 0) ? this.d3Variables.months.labels : this.d3Variables.weeks.labels;
      let timeMax = (timeSelect === 0) ? this.d3Variables.months.max : this.d3Variables.weeks.max;
      let dataNames = (dataSelect === 0) ? this.d3Variables.categoryNames : this.d3Variables.subcategoryNames;
      let dataArray = (dataSelect === 0 && timeSelect === 0) ? this.d3Variables.months.category : (dataSelect === 0 && timeSelect === 1) ? this.d3Variables.weeks.category : (dataSelect === 1 && timeSelect === 0) ? this.d3Variables.months.subcategory : this.d3Variables.weeks.subcategory;

      let color = d3.scaleOrdinal()
      .domain(dataNames)
      .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), dataNames.length).reverse())
      .unknown('#ccc');

      let x = d3.scaleBand()
        .domain(timeNames)
        .range([margin.left, width - margin.right])
        .padding(0.1);

      let y = d3.scaleLinear()
         .domain([0, timeMax])
         .rangeRound([height - margin.bottom, margin.top]);

      let xAxis = g => g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .call(g => g.selectAll('.domain').remove());

      let yAxis = g => g
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, 's'))
        .call(g => g.selectAll('.domain').remove);

      let legend = svg => {
        const g = svg
          .attr('font-family', 'sans-serif')
          .attr('font-size', 10)
          .attr('text-anchor', 'end')
        .selectAll('g')
        .data(dataNames.slice().reverse())
        .enter().append('g')
          .attr('transform', (d, i) => `translate(0,${i * 20})`);

        g.append('rect')
          .attr('x', -19)
          .attr('width', 19)
          .attr('height', 19)
          .attr('fill', color);

        g.append('text')
          .attr('x', -24)
          .attr('y', 9.5)
          .attr('dy', '0.35rem')
          .text(d => d);
      }

      svg.append('g')
      .selectAll('g')
      .data(dataArray)
      .enter().append('g')
        .attr('fill', (d, i) => color(dataNames[i]))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
        .attr('x', (d, i) => x(timeNames[i]))
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth());

      svg.append('g')
        .call(xAxis);

      svg.append('g')
        .call(yAxis);

      svg.append('g')
        .attr('transform', `translate(${width - margin.right},${margin.top})`)
        .call(legend);

      return svg.node();
    }

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

    this.setMax = function(array) {
      $log.debug('SpendingController.setMax()')
      let returnArray = array.slice();
      return returnArray.sort((a,b) => b - a)[0];
    }

    this.addTotals = function(trans, timeIndex, maxArray) {
      $log.debug('SpendingController.addTotals()');
      let returnArray = maxArray.slice();
      returnArray[timeIndex] += trans.amount;
      return returnArray;
    }

    this.subtractTotals = function(trans, timeIndex, maxArray) {
      $log.debug('SpendingController.subctractTotals()');
      let returnArray = maxArray.slice();
      returnArray[timeIndex] -= trans.amount;
      return returnArray;
    }

    this.addChartData = function(amount, dataIndex, length, timeIndex, timeArray) {
      $log.debug('SpendingController.addChartData()');
      for(let i = dataIndex + 1; i < length; i++) {
        timeArray[i][timeIndex][0] += amount;
        timeArray[i][timeIndex][1] += amount
      }
    }

    this.subtractChartData = function(amount, dataIndex, length, timeIndex, timeArray) {
      $log.debug('SpendingController.subtractChartData()');
      for(let i = dataIndex + 1; i < length; i++) {
        timeArray[i][timeIndex][0] -= amount;
        timeArray[i][timeIndex][1] -= amount;
      }
    }

    this.getUserData = function() {
      $log.debug('SpendingController.getUserData()');
      $http.get(this.baseUrl + '/user/transactions/' + this.currentUser.userId, this.config)
        .then((res) => {
          $log.log('res.data', res.data);
          this.user = res.data.user;
          this.transactions = res.data.transactions.tableData;
          this.d3Variables = res.data.transactions.chartData;
          this.selectedTransactions = this.transactions.months[0];
          this.subcategoryLength = res.data.transactions.chartData.subcategoryNames.length;
          this.categoryLength = res.data.transactions.chartData.categoryNames.length;
          this.initChart();
        }, (err) => {
          $log.error('SpendingController.getTransactions()', err);
          // add error response
        });
    }

    this.addToWeek = function(trans) {
      $log.debug('SpendingController.sortWeek()');
      let transMoment = moment(trans.date);
      let categoryIndex = this.d3Variables.categoryNames.indexOf(trans.category.name);
      let subcategoryIndex = this.d3Variables.subcategoryNames.indexOf(trans.subcategory.name);
      let weekIndex = 0

      for (let i = 0; i < 12; i++) {
        if(transMoment.isAfter(moment().startOf('week').subtract((7 * i), 'd')) || transMoment.isSame(moment().startOf('week').subtract((7 * i), 'd'))) {
          weekIndex = i;
          this.transactions.weeks[i].allTransactions.push(trans);
          this.transactions.weeks[i].chartCategories[trans.category.name] += trans.amount;
          this.transactions.weeks[i].chartSubcategories[trans.subcategory.name] += trans.amount;
          this.d3Variables.weeks.category[categoryIndex][i][1] += trans.amount;
          this.d3Variables.weeks.subcategory[subcategoryIndex][i][1] += trans.amount;
          break;
        }
      }

      this.addChartData(trans.amount, categoryIndex, this.categoryLength, weekIndex, this.d3Variables.weeks.category);
      this.addChartData(trans.amount, subcategoryIndex, this.subcategoryLength, weekIndex, this.d3Variables.weeks.subcategory);
    }

    this.deleteFromWeek = function(trans) {
      $log.debug('SpendingController.deleteFromWeek()');
      let transMoment = moment(trans.date);
      let categoryIndex = this.d3Variables.categoryNames.indexOf(trans.category.name);
      let subcategoryIndex = this.d3Variables.subcategoryNames.indexOf(trans.subcategory.name);
      let weekIndex = 0;

      for (let i = 0; i < 12; i++) {
        if (transMoment.isAfter(moment().startOf('week').subtract((7 * i), 'd')) || transMoment.isSame(moment().startOf('week').subtract((7 * i), 'd'))) {
          weekIndex = i;
          this.transactions.weeks[i].allTransactions.splice(this.transactions.weeks[i].indexOf(trans), 1);
          this.transactions.weeks[i].chartCategories[trans.category.name] -= trans.amount;
          this.transactions.weeks[i].chartSubcategories[trans.subcategory.name] -= trans.amount;
          this.d3Variables.weeks.category[categoryIndex][i][1] -= trans.amount;
          this.d3Variables.weeks.subcategory[subcategoryIndex][i][1] -= trans.amount;
          break;
        }
      }
      this.subtractChartData(trans.amount, categoryIndex, this.categoryLength, weekIndex, this.d3Variables.weeks.category);
      this.subtractChartData(trans.amount, subcategoryIndex, this.subcategoryLength, weekIndex, this.d3Variables.weeks.subcategory);
    }

    this.addToMonth = function(trans) {
      $log.debug('SpendingController.sortMonth()');
      let transMoment = moment(trans.date);
      let categoryIndex = this.d3Variables.categoryNames.indexOf(trans.category.name);
      let subcategoryIndex = this.d3Variables.subcategoryNames.indexOf(trans.subcategory.name);
      let monthIndex = 0;

      for(let i = 0; i < 13; i++) {
        if(transMoment.month() === moment().subtract(i, 'M').month() && transMoment.year() === moment().subtract(i, 'M').year()) {
          monthIndex = i;
          this.transactions.months[i].allTransactions.push(trans);
          this.transactions.months[i].chartCategories[trans.category.name] += trans.amount;
          this.transactions.months[i].chartSubcategories[trans.subcategory.name] += trans.amount;
          this.d3Variables.months.category[categoryIndex][i][1] += trans.amount;
          this.d3Variables.months.subcategory[subcategoryIndex][i][1] += trans.amount;
          break;
        }
      }
      this.addChartData(trans.amount, categoryIndex, this.categoryLength, monthIndex, this.d3Variables.months.category);
      this.addChartData(trans.amount, subcategoryIndex, this.subcategoryLength, monthIndex, this.d3Variables.monthssubcategory);
    }

    this.deleteFromMonth = function(trans) {
      $log.debug('SpendingController.deleteFromMonth()');
      let transMoment = moment(trans.date);
      let categoryIndex = this.d3Variables.categoryNames.indexOf(trans.category.name);
      let subcategoryIndex = this.d3Variables.subcategoryNames.indexOf(trans.subcategory.name);
      let monthIndex = 0;

      for(let i = 0; i < 12; i++) {
        if(transMoment.month() === moment().subtract(i, 'M').month() && transMoment.year() === moment().subtract(i, 'M').year()) {
          monthIndex = i;
          this.transactions.months[i].allTransactions.splice(this.transactions.months[i].allTransactions.indexOf(trans), 1);
          this.transactions.months[i].chartCategories[trans.category.name] -= trans.amount;
          this.transactions.months[i].chartSubcategories[trans.subcategory.name] -= trans.amount;
          this.d3Variables.months.category[categoryIndex][i][1] -= trans.amount;
          this.d3Variables.months.subcategory[subcategoryIndex][i][1] -= trans.amount;
          break;
        }
      }
      this.subtractChartData(trans.amount, categoryIndex, this.categoryLength, monthIndex, this.d3Variables.months.category);
      this.subtractChartData(trans.amount, subcategoryIndex, this.subcategoryLength, monthIndex, this.d3Variables.months.subcategory);
    }

    this.formatTransaction = function(trans) {
      $log.debug('SpendingController.formatTransaction()');
      this.sortMonth(trans);
      this.sortWeek(trans);
    }

    this.addTransaction = function(trans) {
      $log.debug('SpendingController.addTransaction()');
      let transMoment = moment(trans.date);
      if (transMoment.isAfter(moment(), 'day')) {
        $log.error('Date cannot be in the future');
        //error response
      } else {
        trans.userId = this.user._id;
        if (trans.date == null || trans.amount == null || trans.category == null || trans.subcategory == null) {
          $log.error('transaction object must have a date, amount, category and subcategory');
          //error response
        } else {
          $http.post(this.baseUrl + '/transaction', trans, this.config)
          .then((res) => {
            $log.log('Successfully added transaction', res.data);
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
      let categoryList = this.d3Variables.categoryNames;
      if (category.name == null || category.userId == null) {
        $log.error('Category must have a name and userId', category.name, category.userId);
        //error response
      } else if (categoryList.includes(category.name)) {
        $log.error('Category already exists');
        //error response
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
      let subcategoryList = this.d3Variables.subcategoryNames;
      if (subcategory.name == null || subcategory.supercategory == null) {
        $log.error('Subcategory must have a name and a supercategory', subcategory.name, subcategory.supercategory);
        // add error response
      } else if (subcategoryList.includes(subcategory.name)) {
        $log.error('Subcategory already exists');
        //add error response
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
          }, (err) => {
            $log.error('Error in SpendingController.addSubcategory()');
            //add error response
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
    }

  }]);
}
