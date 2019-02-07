'use strict';

const moment = require('moment');
moment().format();

const now = moment();
const startOfWeek = now.startOf('week');
const transactionFormatter = {};

transactionFormatter.transactionObject = {
  weeks: [
    {weekOf: startOfWeek, allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {weekOf: startOfWeek.subtract(7, 'd'), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {weekOf: startOfWeek.subtract(14, 'd'), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {weekOf: startOfWeek.subtract(21, 'd'), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {weekOf: startOfWeek.subtract(28, 'd'), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {weekOf: startOfWeek.subtract(35, 'd'), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {weekOf: startOfWeek.subtract(42, 'd'), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {weekOf: startOfWeek.subtract(49, 'd'), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {weekOf: startOfWeek.subtract(56, 'd'), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {weekOf: startOfWeek.subtract(63, 'd'), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {weekOf: startOfWeek.subtract(70, 'd'), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {weekOf: startOfWeek.subtract(77, 'd'), allTransactions: [], chartCategories: {}, chartSubcategories: {}}
  ],
  months: [
    {monthOf: now.month(), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {monthOf: now.subtract(1, 'M').month(), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {monthOf: now.subtract(2, 'M').month(), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {monthOf: now.subtract(3, 'M').month(), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {monthOf: now.subtract(4, 'M').month(), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {monthOf: now.subtract(5, 'M').month(), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {monthOf: now.subtract(6, 'M').month(), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {monthOf: now.subtract(7, 'M').month(), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {monthOf: now.subtract(8, 'M').month(), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {monthOf: now.subtract(9, 'M').month(), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {monthOf: now.subtract(10, 'M').month(), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {monthOf: now.subtract(11, 'M').month(), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {monthOf: now.subtract(12, 'M').month(), allTransactions: [], chartCategories: {}, chartSubcategories: {}}
  ],
}

const getAllCategories = function(array) {
  let names = [];
  array.forEach((obj) => {
    if(names.indexOf(obj.category.name) !== -1) names.push(obj.category.name);
  });
  return names;
}

const getAllSubcategories = function(array) {
  let names = [];
  array.forEach((obj) => {
    if(names.indexOf(obj.subcategory.name) !== -1) names.push(obj.subcategory.name);
  });
  return names;
}

const sortMonth = function(array) {
  let monthArray = [[], [], [], [], [], [], [], [], [], [], [], [], []];
  for (let i = 0; i < 13; i++) {
    monthArray[i] = array.filter((obj) => {
      let transDate = moment(obj.date);
      if (transDate.month() === now.subtract(i, 'M').month() && transDate.year() === now.subtract(i, 'M').year()) {
        return true;
      }
      return false;
    });
  }
  return monthArray;
}

const sortWeek = function(array) {
  let startOfWeek = moment().startOf('week')
  let weekArray = [[], [], [], [], [], [], [], [], [], [], [], []];

  for (let i = 0; i < 12; i++) {
    weekArray[i] = array.filter((obj) => {
      let transDate = moment(obj.date);
      if((transDate.isAfter(startOfWeek.subtract((7 * i), 'd')) || transDate.isSame(startOfWeek.subtract((7 * i), 'd'))) && transDate.isBefore(startOfWeek.subtract((7 * (i - 1)), 'd'))) {
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
  });
}

const setSubcategoryValue = function(subcategory, transactionArray) {
  return transactionArray.filter((trans) => {
    if(trans.subcategory.name === subcategory) return true;
    return false;
  }).reduce((acc, cur) => {
    return acc + cur.amount;
  });
}

transactionFormatter.format = function(transArray) {
  let categories = getAllCategories(transArray);
  let subcategories = getAllSubcategories(transArray);
  let monthArray = sortMonth(transArray);
  let weekArray = sortWeek(transArray);
  placeTransactions(transactionFormatter.transactionObject.months, monthArray);
  placeTransactions(transactionFormatter.transactionObject.weeks, weekArray);
  transactionFormatter.transactionObject.weeks.forEach((week) => {
    week.chartCategories = setChartNames(categories);
    week.chartSubcategories = setChartNames(subcategories);
  });
  transactionFormatter.transactionObject.months.forEach((month) => {
    month.chartCategories = setChartNames(categories);
    month.chartSubcategories = setChartNames(subcategories);
  });
  for(let i = 0; i < categories.length; i++) {
    transactionFormatter.transactionObject.months.forEach((month) => {
      month.chartCategories[categories[i]] = setCategoryValue(categories[i], month.allTransactions);
    });
    transactionFormatter.transactionObject.weeks.forEach((week) => {
      week.chartCategories[categories[i]] = setCategoryValue(categories[i], week.allTransactions);
    });
  }

  for(let i = 0; i < subcategories.length; i++) {
    transactionFormatter.transactionObject.months.forEach((month) => {
      month.chartSubcategories[subcategories[i]] = setSubcategoryValue(subcategories[i], month.allTransactions);
    });
    transactionFormatter.transactionObject.weeks.forEach((week) => {
      week.chartSubcategories[subcategories[i]] = setSubcategoryValue(subcategories[i], week.allTransactions);
    });
  }
  return transactionFormatter.transactionObject;
}

module.exports = exports = transactionFormatter;
