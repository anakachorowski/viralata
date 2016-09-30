'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Fair = mongoose.model('Fair'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Fair
 */
exports.create = function(req, res) {
  var fair = new Fair(req.body);
  fair.user = req.user;

  fair.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fair);
    }
  });
};

/**
 * Show the current Fair
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var fair = req.fair ? req.fair.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  fair.isCurrentUserOwner = req.user && fair.user && fair.user._id.toString() === req.user._id.toString();

  res.jsonp(fair);
};

/**
 * Update a Fair
 */
exports.update = function(req, res) {
  var fair = req.fair;

  fair = _.extend(fair, req.body);

  fair.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fair);
    }
  });
};

/**
 * Delete an Fair
 */
exports.delete = function(req, res) {
  var fair = req.fair;

  fair.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fair);
    }
  });
};

/**
 * List of Fairs
 */
exports.list = function(req, res) {
  Fair.find().sort('-created').populate('user', 'displayName').exec(function(err, fairs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(fairs);
    }
  });
};

/**
 * Fair middleware
 */
exports.fairByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Fair is invalid'
    });
  }

  Fair.findById(id).populate('user', 'displayName').exec(function (err, fair) {
    if (err) {
      return next(err);
    } else if (!fair) {
      return res.status(404).send({
        message: 'No Fair with that identifier has been found'
      });
    }
    req.fair = fair;
    next();
  });
};
