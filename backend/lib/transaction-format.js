'use strict';

const moment = require('moment');
moment.format();

module.exports = exports = function(array) {
  let returnObj = {
    weeks: {
      week1: {all: []},
      week2: {all: []},
      week3: {all: []},
      week4: {all: []},
      week5: {all: []},
      week6: {all: []},
      week7: {all: []},
      week8: {all: []},
      week9: {all: []},
      week10: {all: []},
      week11: {all: []},
      week12: {all: []}
    },
    months: {
      month1: {all: []},
      month2: {all: []},
      month3: {all: []},
      month4: {all: []},
      month5: {all: []},
      month6: {all: []},
      month7: {all: []},
      month8: {all: []},
      month9: {all: []},
      month10: {all: []},
      month11: {all: []},
      month12: {all: []}
    }
  };
  let now = moment();
  let startOfWeek = moment().startOf('week');

  array.forEach(function(obj) {
    let transMoment = moment(obj.date);

    if (transMoment.isBetween(now, startOfWeek)) returnObj.weeks.week1.all.push(transMoment);
    if (transMoment.isBetween(startOfWeek, startOfWeek.subtract(7, 'days'))) returnObj.weeks.week2.all.push(transMoment);
    if(transMoment.isBetween(startOfWeek.subtract(7, 'days'), startOfWeek.subtract(14, 'days'))) returnObj.weeks.week3.all.push(transMoment);
    if(transMoment.isBetween(startOfWeek.subtract(14, 'days'), startOfWeek.subtract(21, 'days'))) returnObj.weeks.week4.all.push(transMoment);
    if(transMoment.isBetween(startOfWeek.subtract(21, 'days'), startOfWeek.subtract(28, 'days'))) returnObj.weeks.week5.all.push(transMoment);
    if(transMoment.isBetween(startOfWeek.subtract(28, 'days'), startOfWeek.subtract(35, 'days'))) returnObj.weeks.week6.all.push(transMoment);
    if(transMoment.isBetween(startOfWeek.subtract(35, 'days'), startOfWeek.subtract(42, 'days'))) returnObj.weeks.week7.all.push(transMoment);
    if(transMoment.isBetween(startOfWeek.subtract(42, 'days'), startOfWeek.subtract(49, 'days'))) returnObj.weeks.week8.all.push(transMoment);
    if(transMoment.isBetween(startOfWeek.subtract(49, 'days'), startOfWeek.subtract(56, 'days'))) returnObj.weeks.week9.all.push(transMoment);
    if(transMoment.isBetween(startOfWeek.subtract(56, 'days'), startOfWeek.subtract(63, 'days'))) returnObj.weeks.week10.all.push(transMoment);
    if(transMoment.isBetween(startOfWeek.subtract(63, 'days'), startOfWeek.subtract(70, 'days'))) returnObj.weeks.week11.all.push(transMoment);
    if(transMoment.isBetween(startOfWeek.subtract(70, 'days'), startOfWeek.subtract(77, 'days'))) returnObj.weeks.week12.all.push(transMoment);

    if(transMoment.month() === now.month() && transMoment.year() === now.year()) returnObj.months.month1.all.push(transMoment);
    if(transMoment.month() === now.subtract(1, 'month').month() && transMoment.year() === now.subtract(1, 'month').year()) returnObj.months.month2.all.push(transMoment);
    if(transMoment.month() === now.subtract(2, 'month').month() && transMoment.year() === now.subtract(2, 'month').year()) returnObj.months.month3.all.push(transMoment);
    if(transMoment.month() === now.subtract(3, 'month').month() && transMoment.year() === now.subtract(3, 'month').year()) returnObj.months.month4.all.push(transMoment);
    if(transMoment.month() === now.subtract(4, 'month').month() && transMoment.year() === now.subtract(4, 'month').year()) returnObj.months.month5.all.push(transMoment);
    if(transMoment.month() === now.subtract(5, 'month').month() && transMoment.year() === now.subtract(5, 'month').year()) returnObj.months.month6.all.push(transMoment);
    if(transMoment.month() === now.subtract(6, 'month').month() && transMoment.year() === now.subtract(6, 'month').year()) returnObj.months.month7.all.push(transMoment);
    if(transMoment.month() === now.subtract(7, 'month').month() && transMoment.year() === now.subtract(7, 'month').year()) returnObj.months.month8.all.push(transMoment);
    if(transMoment.month() === now.subtract(8, 'month').month() && transMoment.year() === now.subtract(8, 'month').year()) returnObj.months.month9.all.push(transMoment);
    if(transMoment.month() === now.subtract(9, 'month').month() && transMoment.year() === now.subtract(9, 'month').year()) returnObj.months.month10.all.push(transMoment);
    if(transMoment.month() === now.subtract(10, 'month').month() && transMoment.year() === now.subtract(10, 'month').year()) returnObj.months.month11.all.push(transMoment);
    if(transMoment.month() === now.subtract(11, 'month').month() && transMoment.year() === now.subtract(11, 'month').year()) returnObj.months.month12.all.push(transMoment);
  });

  returnObj.weeks.week1.forEach(function(obj) {
    if (Object.keys(returnObj.weeks.week1).includes(obj.category.name)) {
      returnObj.weeks.week1[obj.category.name].all.push(obj);
      if(obj.subcategory) {
        if(Object.keys(returnObj.weeks.week1[obj.category]).includes(obj.subcategory.name)) {
          returnObj.weeks.week1[obj.category.name][obj.subcategory.name].all.push(obj);
        } else {
          returnObj.weeks.week1[obj.category.name][obj.subcategory.name] = {all: []};
          returnObj.weeks.week1[obj.category.name][obj.subcategory.name].all.push(obj);
        }
      }
    } else {
      returnObj.weeks.week1[obj.category.name] = {all: []};
      returnObj.weeks.week1[obj.category.name].all.push(obj);
      if(obj.subcategory) {
        returnObj.weeks.week1[obj.category.name][obj.subcategory.name] = {all: []};
        returnObj.weeks.week1[obj.category.name][obj.subcategory.name].all.push(obj);
      }
    }
  });
  return returnObj;
};
