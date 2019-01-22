'use strict';

const User = require('../models/user');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');

var addDefaults = {};
addDefaults.categories = [
  {name: 'Auto', subcategories: ['Auto Payment', 'Auto Insurance', 'Auto Service & Parts', 'Gas', 'Parking']},
  {name: 'Transportation', subcategories: ['Public Transportation', 'Taxi or Ride Share']},
  {name: 'Bills', subcategories: ['Phone', 'Internet', 'Television', 'Utilities']},
  {name: 'Food/Drinks', subcategories: ['Alcohol', 'Groceries', 'Snacks', 'Junk Food', 'Soda']},
  {name: 'Food/Drinks (Out)', subcategories: ['Fast Food', 'Restaurants', 'Bars', 'Coffee Shops']},
  {name: 'Health', subcategories: ['Dentist', 'Doctor', 'Eye Care', 'Mental Health Care', 'Pharmacy', 'Health Insurance']},
  {name: 'Fitness', subcategories: ['Gym', 'Sports Leagues']},
  {name: 'Entertainment', subcategories: ['Computer Games', 'Console Games', 'Mobile Games', 'Movies', 'Music', 'Books', 'Magazines', 'Newspapers']}, {name: 'Personal Care', subcategories: ['Personal Hygiene', 'Laundry', 'Haircuts']},
  {name: 'Shopping', subcategories: ['Sporting Goods', 'Clothes']},
  {name: 'Home', subcategories: ['Mortgage', 'Rent', 'Furnishings', 'Home Improvements', 'Home Services', 'Home Supplies']},
  {name: 'Travel', subcategories: ['Flights', 'Hotel', 'Rental Cars', 'Vacation']},
  {name: 'Fees & Charges', subcategories: ['ATM Fees', 'Bank Fees', 'Finance Charges', 'Late Fees', 'Service Fees']},
  {name: 'Activities', subcategories: ['Concerts', 'Sporting Events', 'Movies']},
  {name: 'Education', subcategories: ['Books', 'Tuition', 'Memberships']}
]

addDefaults.add = function(user) {
  for(let i = 0; i < addDefaults.categories.length; i ++) {
    let newCategory = {userId: user._id, name: addDefaults.categories[i].name};
    user.addCategory(newCategory)
      .then((newCat) => {
        for (let j = 0; j < addDefaults.categories[i].subcategories.length; j++) {
          newCat.addSubcategory({name: addDefaults.categories[i].subcategories[j], userId: user._id, supercategory: newCat._id});
        }
      });
  }
}

module.exports = exports = addDefaults;
