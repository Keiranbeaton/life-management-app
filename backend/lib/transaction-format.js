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

transactionFormatter.format = function(array) {
  let now = moment();
  let startOfWeek = moment().startOf('week');

  array.forEach(function(obj) {
    let transMoment = moment(obj.date);

    for (let i = 0; i < 12; i++) {
      if(transMoment.isAfter(startOfWeek.subtract((7 * i), 'd')) || transMoment.isSame(startOfWeek.subtract((7 * i), 'd'))) {
        transactionFormatter.sort(i, obj, transactionFormatter.return.weeks);
        break;
      }
    }

    for(let i = 0; i < 13; i++) {
      if(transMoment.month() === now.subtract(i, 'M').month() && transMoment.year() === now.subtract(i, 'M').year()) {
        transactionFormatter.sort(i, obj, transactionFormatter.return.months);
        break;
      }
    }
  });

  return transactionFormatter.return;
}
module.exports = exports = transactionFormatter;
