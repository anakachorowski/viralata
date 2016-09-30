'use strict';

/**
 * Module dependencies
 */
var fairsPolicy = require('../policies/fairs.server.policy'),
  fairs = require('../controllers/fairs.server.controller');

module.exports = function(app) {
  // Fairs Routes
  app.route('/api/fairs').all(fairsPolicy.isAllowed)
    .get(fairs.list)
    .post(fairs.create);

  app.route('/api/fairs/:fairId').all(fairsPolicy.isAllowed)
    .get(fairs.read)
    .put(fairs.update)
    .delete(fairs.delete);

  // Finish by binding the Fair middleware
  app.param('fairId', fairs.fairByID);
};
