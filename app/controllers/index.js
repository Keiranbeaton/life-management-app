'use strict';

module.exports = (app) => {
  require('./auth-controller')(app);
  require('./home-controller')(app);
  require('./spending-controller')(app);
}
