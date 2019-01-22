'use strict';

module.exports = (app) => {
  require('./auth')(app);
  require('./home')(app);
  require('./spending')(app);
};
