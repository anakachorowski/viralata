'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Fair Schema
 */
var FairSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Fair name',
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

mongoose.model('Fair', FairSchema);
