'use strict';

module.exports = (app) => {
  require('./auth')(app);
  require('./d3service')(app);
};
