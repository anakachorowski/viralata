'use strict';

/**
 * Module dependencies
 */
var animalsPolicy = require('../policies/animals.server.policy'),
  animals = require('../controllers/animals.server.controller');

module.exports = function(app) {
  // Animals Routes
  app.route('/api/animals').all(animalsPolicy.isAllowed)
    .get(animals.list)
    .post(animals.create);

  app.route('/api/animals/:animalId').all(animalsPolicy.isAllowed)
    .get(animals.read)
    .put(animals.update)
    .delete(animals.delete);

  // Finish by binding the Animal middleware
  app.param('animalId', animals.animalByID);
};
