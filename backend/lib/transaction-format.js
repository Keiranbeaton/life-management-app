'use strict';

const moment = require('moment');
moment().format();

let transactionFormatter = {};

transactionFormatter.return = {
  weeks:[{categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}],
  months:[{categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}, {categoryNames: [], categories: []}]
};
transactionFormatter.sort = function(dateInt, transObj, returnObj) {
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
    console.log('transObj', transObj);
    returnObj[dateInt].categoryNames.push(transObj.category.name);
    console.log('2');
    returnObj[dateInt].categories.push({name: transObj.category.name, subcategories: [], subcategoryNames: []});
    console.log('3', returnObj);
    returnObj[dateInt].categories[returnObj[dateInt].categories.length - 1].subcategoryNames.push(transObj.subcategory.name);
    console.log('4');
    returnObj[dateInt].categories[returnObj[dateInt].categories.length - 1].subcategories.push({name: transObj.subcategory.name, transactions: []});
    console.log('5');
    returnObj[dateInt].categories[returnObj[dateInt].categories.length - 1].subcategories[0].transactions.push(transObj);
  }
}

transactionFormatter.format = function(array) {
  let now = moment();
  let startOfWeek = moment().startOf('week');

  array.forEach(function(obj) {
    let transMoment = moment(obj.date);

    if(transMoment.isBetween(now, startOfWeek)) {
      transactionFormatter.sort(0, obj, transactionFormatter.return.weeks);
    } else if (transMoment.isBetween(startOfWeek, startOfWeek.subtract(7, 'd'))) {
      transactionFormatter.sort(1, obj, transactionFormatter.return.weeks);
    } else if (transMoment.isBetween(startOfWeek.subtract(7, 'd'), startOfWeek.subtract(14, 'd'))) {
      transactionFormatter.sort(2, obj, transactionFormatter.return.weeks);
    } else if (transMoment.isBetween(startOfWeek.subtract(14, 'd'), startOfWeek.subtract(21, 'd'))) {
      transactionFormatter.sort(3, obj, transactionFormatter.return.weeks);
    } else if (transMoment.isBetween(startOfWeek.subtract(21, 'd'), startOfWeek.subtract(28, 'd'))) {
      transactionFormatter.sort(4, obj, transactionFormatter.return.weeks);
    } else if (transMoment.isBetween(startOfWeek.subtract(28, 'd'), startOfWeek.subtract(35, 'd'))) {
      transactionFormatter.sort(5, obj, transactionFormatter.return.weeks);
    } else if (transMoment.isBetween(startOfWeek.subtract(35, 'd'), startOfWeek.subtract(42, 'd'))) {
      transactionFormatter.sort(6, obj, transactionFormatter.return.weeks);
    } else if (transMoment.isBetween(startOfWeek.subtract(42, 'd'), startOfWeek.subtract(49, 'd'))) {
      transactionFormatter.sort(7, obj, transactionFormatter.return.weeks);
    } else if (transMoment.isBetween(startOfWeek.subtract(49, 'd'), startOfWeek.subtract(56, 'd'))) {
      transactionFormatter.sort(8, obj, transactionFormatter.return.weeks);
    } else if (transMoment.isBetween(startOfWeek.subtract(56, 'd'), startOfWeek.subtract(63, 'd'))) {
      transactionFormatter.sort(9, obj, transactionFormatter.return.weeks);
    } else if (transMoment.isBetween(startOfWeek.subtract(63, 'd'), startOfWeek.subtract(70, 'd'))) {
      transactionFormatter.sort(10, obj, transactionFormatter.return.weeks);
    } else if (transMoment.isBetween(startOfWeek.subtract(70, 'd'), startOfWeek.subtract(77, 'd'))) {
      transactionFormatter.sort(11, obj, transactionFormatter.return.weeks);
    } else {
      console.log('');
    }

    if (transMoment.month() === now.month() && transMoment.year() === now.year()) {
      transactionFormatter.sort(0, obj, transactionFormatter.return.months);
    } else if (transMoment.month() === now.subtract(1, 'M').month() && transMoment.year() === now.subtract(1, 'M').year()) {
      transactionFormatter.sort(1, obj, transactionFormatter.return.months);
    } else if (transMoment.month() === now.subtract(2, 'M').month() && transMoment.year() === now.subtract(2, 'M').year()) {
      transactionFormatter.sort(2, obj, transactionFormatter.return.months);
    } else if (transMoment.month() === now.subtract(3, 'M').month() && transMoment.year() === now.subtract(3, 'M').year()) {
      transactionFormatter.sort(3, obj, transactionFormatter.return.months);
    } else if (transMoment.month() === now.subtract(4, 'M').month() && transMoment.year() === now.subtract(4, 'M').year()) {
      transactionFormatter.sort(4, obj, transactionFormatter.return.months);
    } else if (transMoment.month() === now.subtract(5, 'M').month() && transMoment.year() === now.subtract(5, 'M').year()) {
      transactionFormatter.sort(5, obj, transactionFormatter.return.months);
    } else if (transMoment.month() === now.subtract(6, 'M').month() && transMoment.year() === now.subtract(6, 'M').year()) {
      transactionFormatter.sort(6, obj, transactionFormatter.return.months);
    } else if (transMoment.month() === now.subtract(7, 'M').month() && transMoment.year() === now.subtract(7, 'M').year()) {
      transactionFormatter.sort(7, obj, transactionFormatter.return.months);
    } else if (transMoment.month() === now.subtract(8, 'M').month() && transMoment.year() === now.subtract(8, 'M').year()) {
      transactionFormatter.sort(8, obj, transactionFormatter.return.months);
    } else if (transMoment.month() === now.subtract(9, 'M').month() && transMoment.year() === now.subtract(9, 'M').year()) {
      transactionFormatter.sort(9, obj, transactionFormatter.return.months);
    } else if (transMoment.month() === now.subtract(10, 'M').month() && transMoment.year() === now.subtract(10, 'M').year()) {
      transactionFormatter.sort(10, obj, transactionFormatter.return.months);
    } else if (transMoment.month() === now.subtract(11, 'M').month() && transMoment.year() === now.subtract(11, 'M').year()) {
      transactionFormatter.sort(11, obj, transactionFormatter.return.months);
    } else if (transMoment.month() === now.subtract(12, 'M').month() && transMoment.year() === now.subtract(12, 'M').year()) {
      transactionFormatter.sort(12, obj, transactionFormatter.return.months);
    } else {
      console.log('');
    }
  });

  return transactionFormatter.return;
}
module.exports = exports = transactionFormatter;
