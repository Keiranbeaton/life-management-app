'use strict';

const moment = require('moment');
moment().format();

const transactionFormatter = {};
transactionFormatter.transactionObject = {
  weeks: [
    {label: moment().startOf("week").format("MMM Do"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().startOf("week").subtract(7, 'd').format("MMM Do"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().startOf("week").subtract(14, 'd').format("MMM Do"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().startOf("week").subtract(21, 'd').format("MMM Do"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().startOf("week").subtract(28, 'd').format("MMM Do"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().startOf("week").subtract(35, 'd').format("MMM Do"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().startOf("week").subtract(42, 'd').format("MMM Do"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().startOf("week").subtract(49, 'd').format("MMM Do"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().startOf("week").subtract(56, 'd').format("MMM Do"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().startOf("week").subtract(63, 'd').format("MMM Do"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().startOf("week").subtract(70, 'd').format("MMM Do"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().startOf("week").subtract(77, 'd').format("MMM Do"), allTransactions: [], categoryData: [], subcategoryData: []}
  ],
  months: [
    {label: moment().format("MMM YY"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().subtract(1, 'M').format("MMM YY"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().subtract(2, 'M').format("MMM YY"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().subtract(3, 'M').format("MMM YY"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().subtract(4, 'M').format("MMM YY"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().subtract(5, 'M').format("MMM YY"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().subtract(6, 'M').format("MMM YY"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().subtract(7, 'M').format("MMM YY"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().subtract(8, 'M').format("MMM YY"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().subtract(9, 'M').format("MMM YY"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().subtract(10, 'M').format("MMM YY"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().subtract(11, 'M').format("MMM YY"), allTransactions: [], categoryData: [], subcategoryData: []},
    {label: moment().subtract(12, 'M').format("MMM YY"), allTransactions: [], categoryData: [], subcategoryData: []}
  ]
}

const getAllCategories = function(array) {
  let categories = [];
  array.forEach((obj) => {
    if(categories.indexOf(obj.category) === -1) {
      categories.push(obj.category);
    }
  });
  return categories;
}

const getAllSubcategories = function(array) {
  let subcategories = [];
  array.forEach((obj) => {
    if(subcategories.indexOf(obj.subcategory) === -1) {
      subcategories.push(obj.subcategory);
    }
  });
  return subcategories;
}

const sortMonth = function(array) {
  let monthArray = [[], [], [], [], [], [], [], [], [], [], [], [], []];
  for (let i = 0; i < 13; i++) {
    monthArray[i] = array.filter((obj) => {
      let transDate = moment(obj.date);
      if (transDate.month() === moment().subtract(i, 'M').month() && transDate.year() === moment().subtract(i, 'M').year()) {
        return true;
      }
      return false;
    });
  }
  return monthArray;
}

const sortWeek = function(array) {
  let weekArray = [[], [], [], [], [], [], [], [], [], [], [], []];

  for (let i = 0; i < 12; i++) {
    weekArray[i] = array.filter((obj) => {
      let transDate = moment(obj.date);
      if((transDate.isAfter(moment().startOf('week').subtract((7 * i), 'd')) || transDate.isSame(moment().startOf('week').subtract((7 * i), 'd'))) && transDate.isBefore(moment().startOf('week').subtract((7 * (i - 1)), 'd'))) {
        return true;
      }
      return false;
    })
  }
  return weekArray;
}

const placeTransactions = function(destination, original) {
  for (let i = 0; i < original.length; i++) {
    destination[i].allTransactions = original[i];
  }
}

const createD3Object = function(categoriesArray, timePeriodArray) {
  let returnArray = [];
  for (let i = 0; i < categoriesArray.length; i++) {
    let helperArray = [];
    for (let j = 0; j < timePeriodArray.length; j ++) {
      let amount = timePeriodArray[j].allTransactions.filter((trans) => {
        if (trans.category._id === categoriesArray[i]._id) {
          return true;
        }
        return false;
      }).reduce((acc, cur) => {
        let num = acc + cur.amount;
        return Math.round(num * 100) / 100;
      }, 0);
      let startValue = 0;
      if (i !== 0) {
        startValue = returnArray[i-1][j][1];
      }
      let endValue = startValue + amount;
      helperArray.push([startValue, endValue, amount]);
    }
    returnArray.push(helperArray);
  }
  return returnArray;
}

transactionFormatter.format = function(transArray) {
  transactionFormatter.transactionObject.categories = getAllCategories(transArray);
  transactionFormatter.transactionObject.subcategories = getAllSubcategories(transArray);
  let monthArray = sortMonth(transArray);
  let weekArray = sortWeek(transArray);
  placeTransactions(transactionFormatter.transactionObject.months, monthArray);
  placeTransactions(transactionFormatter.transactionObject.weeks, weekArray);

  transactionFormatter.transactionObject.weeks.categoryData = createD3Object(transactionFormatter.transactionObject.categories, transactionFormatter.transactionObject.weeks);
  transactionFormatter.transactionObject.months.categoryData = createD3Object(transactionFormatter.transactionObject.categories, transactionFormatter.transactionObject.months);
  transactionFormatter.transactionObject.weeks.subcategoryData = createD3Object(transactionFormatter.transactionObject.subcategories, transactionFormatter.transactionObject.weeks);
  transactionFormatter.transactionObject.months.subcategoryData = createD3Object(transactionFormatter.transactionObject.subcategories, transactionFormatter.transactionObject.months);

  return transactionFormatter.transactionObject;
}

module.exports = exports = transactionFormatter;
