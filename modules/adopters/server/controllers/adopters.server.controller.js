'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Adopter = mongoose.model('Adopter'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Adopter
 */
exports.create = function(req, res) {
  var adopter = new Adopter(req.body);
  adopter.user = req.user;

  adopter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adopter);
    }
  });
};

/**
 * Show the current Adopter
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var adopter = req.adopter ? req.adopter.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  adopter.isCurrentUserOwner = req.user && adopter.user && adopter.user._id.toString() === req.user._id.toString();

  res.jsonp(adopter);
};

/**
 * Update a Adopter
 */
exports.update = function(req, res) {
  var adopter = req.adopter;

  adopter = _.extend(adopter, req.body);

  adopter.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adopter);
    }
  });
};

/**
 * Delete an Adopter
 */
exports.delete = function(req, res) {
  var adopter = req.adopter;

  adopter.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adopter);
    }
  });
};

/**
 * List of Adopters
 */
exports.list = function(req, res) {
  Adopter.find().sort('-created').populate('user', 'displayName').exec(function(err, adopters) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(adopters);
    }
  });
};

/**
 * Adopter middleware
 */
exports.adopterByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Adopter is invalid'
    });
  }

  Adopter.findById(id).populate('user', 'displayName').exec(function (err, adopter) {
    if (err) {
      return next(err);
    } else if (!adopter) {
      return res.status(404).send({
        message: 'No Adopter with that identifier has been found'
      });
    }
    req.adopter = adopter;
    next();
  });
};
