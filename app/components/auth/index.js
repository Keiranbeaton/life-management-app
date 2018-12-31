'use strict';

module.exports = (app) => {
  require('./login')(app);
  require('./signup')(app);
  require('./logout')(app);
};
