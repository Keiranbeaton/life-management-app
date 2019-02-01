'use strict';

module.exports = (app) => {
  require('./bar-chart')(app);
  require('./pie-chart')(app);
};
