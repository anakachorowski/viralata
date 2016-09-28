'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Animal = mongoose.model('Animal'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Animal
 */
exports.create = function(req, res) {
  var animal = new Animal(req.body);
  animal.user = req.user;

  animal.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(animal);
    }
  });
};

/**
 * Show the current Animal
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var animal = req.animal ? req.animal.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  animal.isCurrentUserOwner = req.user && animal.user && animal.user._id.toString() === req.user._id.toString();

  res.jsonp(animal);
};

/**
 * Update a Animal
 */
exports.update = function(req, res) {
  var animal = req.animal;

  animal = _.extend(animal, req.body);

  animal.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(animal);
    }
  });
};

/**
 * Delete an Animal
 */
exports.delete = function(req, res) {
  var animal = req.animal;

  animal.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(animal);
    }
  });
};

/**
 * List of Animals
 */
exports.list = function(req, res) {
  Animal.find().sort('-created').populate('user', 'displayName').exec(function(err, animals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(animals);
    }
  });
};

/**
 * Animal middleware
 */
exports.animalByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Animal is invalid'
    });
  }

  Animal.findById(id).populate('user', 'displayName').exec(function (err, animal) {
    if (err) {
      return next(err);
    } else if (!animal) {
      return res.status(404).send({
        message: 'No Animal with that identifier has been found'
      });
    }
    req.animal = animal;
    next();
  });
};
