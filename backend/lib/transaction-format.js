'use strict';

const moment = require('moment');
moment().format();

const now = moment();
const transactionFormatter = {};

transactionFormatter.format = function(array) {
  let categories = getAllCategories(array);
  let subcategories = getAllSubcategories(array);
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


const transactionObject = {
  weeks: [
    { allTransactions: [], chartCategories: {}, chartSubcategories: {}},
  ],
  months: [],
}

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



const getCategories = function(array) {
  let names = [];
  array.forEach((obj) => {
    if(names.indexOf(obj.category.name) !== -1) {
      names.push(obj.category.name);
    }
  });
  return names;
}

const filterCategories = function(array, category) {
  let returnArray = array.filter((obj) => {
    if (obj.category.name === category) return true;
    return false;
  });
  return returnArray;
}

const sortCategory = function(array) {
  let categories = getCategories(array);
  let returnObj = {};
  for (let i = 0; i < categories.length; i++) {
    returnObj[categories[i]] = filterCategories(array, categories[i]);
  }
  return returnObj;
}

const getSubcategories = function(array) {
  let names = [];
  array.forEach((obj) => {
    if(names.indeOf(obj.subcategory.name) !== -1) {
      names.push(obj.subcategory.name);
    }
  });
  return names;
}

const filterSubcategory = function(array, subcategory) {
  let returnArray = array.filter((obj) => {
    if(obj.subcategory.name === subcategory) return true;
    return false;
  });
  return returnArray;
}

const sortSubcategory = function(array) {
  let subcategories = getSubcategories(array);
  let returnObj = {};
  for (let i = 0; i < subcategories.length; i ++);
}

transactionFormatter.format = function(array) {
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
