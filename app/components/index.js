'use strict';

module.exports = (app) => {
  require('./home')(app);
  require('./auth')(app);
};
