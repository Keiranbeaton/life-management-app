'use strict';

const moment = require('moment');
moment().format();

const transactionFormatter = {};
transactionFormatter.transactionObject = {};
transactionFormatter.transactionObject.tableData = {
  weeks: [
    {label: moment().startOf("week").format("MMM Do"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().startOf("week").subtract(7, 'd').format("MMM Do"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().startOf("week").subtract(14, 'd').format("MMM Do"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().startOf("week").subtract(21, 'd').format("MMM Do"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().startOf("week").subtract(28, 'd').format("MMM Do"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().startOf("week").subtract(35, 'd').format("MMM Do"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().startOf("week").subtract(42, 'd').format("MMM Do"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().startOf("week").subtract(49, 'd').format("MMM Do"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().startOf("week").subtract(56, 'd').format("MMM Do"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().startOf("week").subtract(63, 'd').format("MMM Do"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().startOf("week").subtract(70, 'd').format("MMM Do"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().startOf("week").subtract(77, 'd').format("MMM Do"), allTransactions: [], chartCategories: {}, chartSubcategories: {}}
  ],
  months: [
    {label: moment().format("MMM YY"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().subtract(1, 'M').format("MMM YY"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().subtract(2, 'M').format("MMM YY"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().subtract(3, 'M').format("MMM YY"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().subtract(4, 'M').format("MMM YY"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().subtract(5, 'M').format("MMM YY"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().subtract(6, 'M').format("MMM YY"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().subtract(7, 'M').format("MMM YY"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().subtract(8, 'M').format("MMM YY"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().subtract(9, 'M').format("MMM YY"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().subtract(10, 'M').format("MMM YY"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().subtract(11, 'M').format("MMM YY"), allTransactions: [], chartCategories: {}, chartSubcategories: {}},
    {label: moment().subtract(12, 'M').format("MMM YY"), allTransactions: [], chartCategories: {}, chartSubcategories: {}}
  ]
}

transactionFormatter.transactionObject.chartData = {
  categoryNames: [],
  subcategoryNames: [],
  weeks: {labels: [], category: [], subcategory: [], max: 0},
  months: {labels: [], category: [], subcategory: [], max: 0}
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
    let num = acc + cur.amount;
    let num2 = num * 100;
    let num3 = Math.round(num2);
    let num4 = num3 / 100;
    return num4;
  }, 0);
}

const setSubcategoryValue = function(subcategory, transactionArray) {
  return transactionArray.filter((trans) => {
    if(trans.subcategory.name === subcategory) return true;
    return false;
  }).reduce((acc, cur) => {
    let num = acc + cur.amount;
    let num2 = num * 100;
    let num3 = Math.round(num2);
    let num4 = num3 / 100;
    return num4;
  }, 0);
}

const createD3Object = function(categoryArray, timeArray, categoryPropertyName) {
  let returnArray = [];
  for(let i = 0; i < categoryArray.length; i++) {
    let helperArray = []
    for (let j = 0; j < timeArray.length; j++) {
      let amount = timeArray[j][categoryPropertyName][categoryArray[i]];
      let startValue = 0
      if(i !== 0) {
        startValue = returnArray[i-1][j][1];
      }
      let endValue = startValue + amount;
      helperArray.push([startValue, endValue]);
    }
    returnArray.push(helperArray);
  }
  return returnArray;
}

const getMaxArray = function(timeObj) {
  let totalsArray = timeObj.map((period) => {
      return period.allTransactions.reduce((acc, cur) => {
        let num = acc + cur.amount;
        return Math.round(num * 100) / 100;
      }, 0);
    });
  return totalsArray;
}

const getMax = function(maxArray) {
  return maxArray.slice().sort((a,b) => b - a)[0];
}

const getLabels = function(timeObj) {
  return timeObj.map(obj => obj.label);
}

transactionFormatter.format = function(transArray) {
  let categories = getAllCategories(transArray);
  let subcategories = getAllSubcategories(transArray);
  let monthArray = sortMonth(transArray);
  let weekArray = sortWeek(transArray);
  placeTransactions(transactionFormatter.transactionObject.tableData.months, monthArray);
  placeTransactions(transactionFormatter.transactionObject.tableData.weeks, weekArray);
  transactionFormatter.transactionObject.tableData.weeks.forEach((week) => {
    week.chartCategories = setChartNames(categories);
    week.chartSubcategories = setChartNames(subcategories);
  });
  transactionFormatter.transactionObject.tableData.months.forEach((month) => {
    month.chartCategories = setChartNames(categories);
    month.chartSubcategories = setChartNames(subcategories);
  });
  for(let i = 0; i < categories.length; i++) {
    transactionFormatter.transactionObject.tableData.months.forEach((month) => {
      month.chartCategories[categories[i]] = setCategoryValue(categories[i], month.allTransactions);
    });
    transactionFormatter.transactionObject.tableData.weeks.forEach((week) => {
      week.chartCategories[categories[i]] = setCategoryValue(categories[i], week.allTransactions);
    });
  }
  for(let i = 0; i < subcategories.length; i++) {
    transactionFormatter.transactionObject.tableData.months.forEach((month) => {
      month.chartSubcategories[subcategories[i]] = setSubcategoryValue(subcategories[i], month.allTransactions);
    });
    transactionFormatter.transactionObject.tableData.weeks.forEach((week) => {
      week.chartSubcategories[subcategories[i]] = setSubcategoryValue(subcategories[i], week.allTransactions);
    });
  }

  transactionFormatter.transactionObject.chartData.weeks.category = createD3Object(categories, transactionFormatter.transactionObject.tableData.weeks, 'chartCategories');
  transactionFormatter.transactionObject.chartData.months.category = createD3Object(categories, transactionFormatter.transactionObject.tableData.months, 'chartCategories');
  transactionFormatter.transactionObject.chartData.weeks.subcategory = createD3Object(subcategories, transactionFormatter.transactionObject.tableData.weeks, 'chartSubcategories');
  transactionFormatter.transactionObject.chartData.months.subcategory = createD3Object(subcategories, transactionFormatter.transactionObject.tableData.months, 'chartSubcategories');
  transactionFormatter.transactionObject.chartData.weeks.maxArray = getMaxArray(transactionFormatter.transactionObject.tableData.weeks);
  transactionFormatter.transactionObject.chartData.weeks.max = getMax(transactionFormatter.transactionObject.chartData.weeks.maxArray);
  transactionFormatter.transactionObject.chartData.months.maxArray = getMaxArray(transactionFormatter.transactionObject.tableData.months);
  transactionFormatter.transactionObject.chartData.months.max = getMax(transactionFormatter.transactionObject.chartData.months.maxArray);
  transactionFormatter.transactionObject.chartData.weeks.labels = getLabels(transactionFormatter.transactionObject.tableData.weeks);
  transactionFormatter.transactionObject.chartData.months.labels = getLabels(transactionFormatter.transactionObject.tableData.months);
  transactionFormatter.transactionObject.chartData.categoryNames = categories;
  transactionFormatter.transactionObject.chartData.subcategoryNames = subcategories;

  return transactionFormatter.transactionObject;
}

module.exports = exports = transactionFormatter;
