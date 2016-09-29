'use strict';

/**
 * Module dependencies
 */
var adoptersPolicy = require('../policies/adopters.server.policy'),
  adopters = require('../controllers/adopters.server.controller');

module.exports = function(app) {
  // Adopters Routes
  app.route('/api/adopters').all(adoptersPolicy.isAllowed)
    .get(adopters.list)
    .post(adopters.create);

  app.route('/api/adopters/:adopterId').all(adoptersPolicy.isAllowed)
    .get(adopters.read)
    .put(adopters.update)
    .delete(adopters.delete);

  // Finish by binding the Adopter middleware
  app.param('adopterId', adopters.adopterByID);
};
