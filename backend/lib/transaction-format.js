'use strict';

const moment = require('moment');
moment().format();
const date = new Date();
const transactionFormatter = {};

transactionFormatter.transactionObject = {
  weeks: [
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    { allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}}
  ],
  months: [
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {allTransactions: [], chartCategories: {}, chartSubcategories: {}}
  ],
}

const getAllCategories = function(array) {
  let names = [];
  array.forEach((obj) => {
    if(names.indexOf(obj.category.name) === -1) {
      names.push(obj.category.name);
    }
  });
  return names;
}

const getAllSubcategories = function(array) {
  let names = [];
  array.forEach((obj) => {
    if(names.indexOf(obj.subcategory.name) === -1) {
      names.push(obj.subcategory.name);
    }
  });
  return names;
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

const setChartNames = function(array) {
  let categoryObj = {};
  for (let i = 0; i < array.length; i++) {
    categoryObj[array[i]] = 0;
  }
  return categoryObj;
}

const setCategoryValue = function(category, transactionArray) {
  return transactionArray.filter((trans) => {
    if (trans.category.name === category) return true;
    return false;
  }).reduce((acc, cur) => {
    return acc + cur.amount;
  }, 0);
}

const setSubcategoryValue = function(subcategory, transactionArray) {
  return transactionArray.filter((trans) => {
    if(trans.subcategory.name === subcategory) return true;
    return false;
  }).reduce((acc, cur) => {
    return acc + cur.amount;
  }, 0);
}

transactionFormatter.format = function(transArray) {
  console.log('transArray', transArray);
  let categories = getAllCategories(transArray);
  let subcategories = getAllSubcategories(transArray);
  let monthArray = sortMonth(transArray);
  console.log('monthArray', monthArray);
  let weekArray = sortWeek(transArray);
  console.log('weekArray', weekArray);
  placeTransactions(transactionFormatter.transactionObject.months, monthArray);
  placeTransactions(transactionFormatter.transactionObject.weeks, weekArray);
  // console.log('transactionFormatter.transactionObject.months', transactionFormatter.transactionObject.months);
  // console.log('transactionFormatter.transactionObject.weeks', transactionFormatter.transactionObject.weeks);
  transactionFormatter.transactionObject.weeks.forEach((week) => {
    week.chartCategories = setChartNames(categories);
    week.chartSubcategories = setChartNames(subcategories);
  });
  // console.log('transactionFormatter.transactionObject.weeks after setChartNames', transactionFormatter.transactionObject.weeks);
  transactionFormatter.transactionObject.months.forEach((month) => {
    month.chartCategories = setChartNames(categories);
    month.chartSubcategories = setChartNames(subcategories);
  });
  // console.log('transactionFormatter.transactionObject.months after setChartNames', transactionFormatter.transactionObject.months);
  for(let i = 0; i < categories.length; i++) {
    transactionFormatter.transactionObject.months.forEach((month) => {
      month.chartCategories[categories[i]] = setCategoryValue(categories[i], month.allTransactions);
    });
    transactionFormatter.transactionObject.weeks.forEach((week) => {
      week.chartCategories[categories[i]] = setCategoryValue(categories[i], week.allTransactions);
    });
  }
  // console.log('transactionFormatter.transactionObject.months after setCategoryValue', transactionFormatter.transactionObject.months);
  // console.log('transactionFormatter.transactionObject.weeks after setCategoryValue', transactionFormatter.transactionObject.weeks);
  for(let i = 0; i < subcategories.length; i++) {
    transactionFormatter.transactionObject.months.forEach((month) => {
      month.chartSubcategories[subcategories[i]] = setSubcategoryValue(subcategories[i], month.allTransactions);
    });
    transactionFormatter.transactionObject.weeks.forEach((week) => {
      week.chartSubcategories[subcategories[i]] = setSubcategoryValue(subcategories[i], week.allTransactions);
    });
  }
  // console.log('transactionFormatter.transactionObject.months after setSubcategoryValue', transactionFormatter.transactionObject.months);
  // console.log('transactionFormatter.transactionObject.weeks after setSubcategoryValue', transactionFormatter.transactionObject.weeks);

  return transactionFormatter.transactionObject;
}

module.exports = exports = transactionFormatter;
