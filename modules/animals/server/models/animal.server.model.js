'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Animal Schema
 */
var AnimalSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Animal name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Animal', AnimalSchema);
