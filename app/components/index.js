'use strict';

module.exports = (app) => {
  require('./auth')(app);
  require('./home')(app);
  require('./spending')(app);
  require('./d3')(app);
};
