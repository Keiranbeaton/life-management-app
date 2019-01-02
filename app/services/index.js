'use strict';

module.exports = (app) => {
  require('./auth')(app);
  require('./transaction')(app);
};
